import Stripe from "stripe";
import prisma from "../lib/prisma.js";
import { sendPurchaseReceiptEmail } from "../lib/email.js";

// Inicialización segura de Stripe
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

const checkStripe = (res) => {
  if (!stripe) {
    res.status(500).json({ message: "Configuración de Stripe faltante en el servidor" });
    return false;
  }
  return true;
};

const PLAN_CONFIG = {
  basico: {
    priceId: process.env.STRIPE_PRICE_BASIC_MONTHLY,
    planType: "MONTHLY",
  },
  profesional: {
    priceId: process.env.STRIPE_PRICE_PRO_ANNUAL,
    planType: "YEARLY",
  },
};

const STATUS_MAP = {
  active: "ACTIVE",
  canceled: "CANCELED",
  past_due: "PAST_DUE",
  incomplete: "INCOMPLETE",
  incomplete_expired: "INCOMPLETE",
  unpaid: "PAST_DUE",
  trialing: "ACTIVE",
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const ensureUniqueSlug = async (baseSlug) => {
  let slug = baseSlug;
  let suffix = 1;
  while (true) {
    const existing = await prisma.branch.findUnique({ where: { slug } });
    if (!existing) return slug;
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
};

export const createCheckoutSession = async (req, res) => {
  if (!checkStripe(res)) return;
  const { planId, branchName, branchSlug, userId, email } = req.body || {};

  if (!planId || !PLAN_CONFIG[planId]) {
    return res.status(400).json({ message: "Plan invalido" });
  }
  if (!branchName || !userId) {
    return res.status(400).json({ message: "Faltan datos de sucursal o usuario" });
  }

  const { priceId } = PLAN_CONFIG[planId];
  if (!priceId) {
    return res.status(500).json({ message: "Plan sin configuracion de Stripe" });
  }

  try {
    const origin = req.headers.origin || process.env.APP_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      allow_promotion_codes: true,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      client_reference_id: userId,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/${planId}`,
      metadata: {
        planId,
        branchName,
        branchSlug: branchSlug || "",
        userId,
        userEmail: email || "",
        branchId: req.body.branchId || "",
      },
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error);
    return res.status(500).json({ message: "No se pudo iniciar el pago" });
  }
};

export const confirmSession = async (req, res) => {
  if (!checkStripe(res)) return;
  const sessionId = req.query.session_id || req.query.sessionId;
  if (!sessionId) {
    return res.status(400).json({ message: "Falta session_id" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "subscription.items.data.price"],
    });

    if (!session || !session.subscription) {
      return res.status(400).json({ message: "Sesion no valida" });
    }

    if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
      return res.status(400).json({ message: "Pago no confirmado" });
    }

    const metadata = session.metadata || {};
    const planId = metadata.planId;
    const branchName = metadata.branchName;
    const branchSlugRaw = metadata.branchSlug;
    const userId = metadata.userId;
    const branchId = metadata.branchId; // Get existing branch ID if present

    if (!planId || !branchName || !userId) {
      return res.status(400).json({ message: "Metadata incompleta" });
    }

    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
    
    // Obtener la suscripción directamente para asegurar datos frescos
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const existingBySub = await prisma.branch.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });
    
    if (existingBySub) {
      console.log("SUCURSAL YA EXISTENTE PARA ESTA SUB:", subscription.id);
      return res.status(200).json({ branch: existingBySub, subscriptionId: subscription.id });
    }

    const planType = PLAN_CONFIG[planId]?.planType || "MONTHLY";
    const subscriptionStatus = STATUS_MAP[subscription.status] || "INCOMPLETE";
    
    // Obtener el Price ID del primer item de la suscripción
    const priceId = subscription.items?.data?.[0]?.price?.id || null;
    
    // Convertir el timestamp de Unix a Date de JS con FALLBACK de seguridad
    let currentPeriodEnd = subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000)
      : null;

    // SEGURIDAD: Si Stripe no mandó fecha, la calculamos nosotros para no dejar null/1970
    if (!currentPeriodEnd || isNaN(currentPeriodEnd.getTime())) {
      console.log("⚠️ Alerta: Stripe no envió fecha válida. Calculando fallback...");
      currentPeriodEnd = new Date();
      if (planType === 'YEARLY') {
        currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
      } else {
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
      }
    }

    console.log(`PROCESANDO PAGO - PLAN: ${planType}, EXPIRA: ${currentPeriodEnd.toISOString()}`);

    let branch;

    if (branchId && branchId.trim() !== "") {
      // RENEWAL: Update existing branch
      branch = await prisma.branch.update({
        where: { id: branchId },
        data: {
          plan: planType,
          subscriptionStatus,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          currentPeriodEnd,
        },
        include: { owner: true }
      });
    } else {
      // NEW: Create new branch
      const baseSlug = slugify(branchSlugRaw || branchName);
      const slug = await ensureUniqueSlug(baseSlug);
      branch = await prisma.branch.create({
        data: {
          name: branchName,
          slug,
          ownerId: userId,
          status: "Offline",
          plan: planType,
          subscriptionStatus,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          currentPeriodEnd,
        },
        include: { owner: true }
      });
    }

    // Enviar correo de recibo/agradecimiento (AWAIT para asegurar envío)
    if (branch && (branch.subscriptionStatus === 'ACTIVE' || subscription.status === 'active' || subscription.status === 'trialing')) {
      const recipientEmail = metadata.userEmail || branch.owner?.email;
      const recipientName = branch.owner?.name || "Cliente";
      
      console.log(`[EMAIL] Enviando recibo. Sucursal: ${branch.name}, Expira: ${branch.currentPeriodEnd}`);
      
      try {
        const amountPaid = planType === 'YEARLY' ? 5390 : 539;
        await sendPurchaseReceiptEmail(
          recipientEmail,
          recipientName,
          branch.name,
          planType,
          amountPaid,
          branch.currentPeriodEnd // Usar el valor verificado
        );
        console.log("✅ [EMAIL] Recibo enviado exitosamente");
      } catch (emailErr) {
        console.error("❌ [EMAIL] Error crítico en el proceso de envío:", emailErr.message);
      }
    }

    return res.status(200).json({
      branch,
      subscriptionId: subscription.id,
      planId,
      status: subscriptionStatus,
    });
  } catch (error) {
    console.error("Stripe confirm error:", error);
    return res.status(500).json({ message: "No se pudo confirmar el pago" });
  }
};

export const updateSubscription = async (req, res) => {
  if (!checkStripe(res)) return;
  const { branchId, planId } = req.body || {};
  if (!branchId || !planId || !PLAN_CONFIG[planId]) {
    return res.status(400).json({ message: "Datos invalidos" });
  }

  try {
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch || !branch.stripeSubscriptionId) {
      return res.status(400).json({ message: "Sucursal sin suscripcion activa" });
    }

    const { priceId, planType } = PLAN_CONFIG[planId];
    if (!priceId) {
      return res.status(500).json({ message: "Plan sin precio configurado" });
    }

    const subscription = await stripe.subscriptions.retrieve(branch.stripeSubscriptionId);
    const currentItem = subscription.items?.data?.[0];
    if (!currentItem?.id) {
      return res.status(400).json({ message: "Suscripcion invalida" });
    }

    const updated = await stripe.subscriptions.update(subscription.id, {
      items: [{ id: currentItem.id, price: priceId }],
      proration_behavior: "create_prorations",
      payment_behavior: "always_invoice",
    });

    const subscriptionStatus = STATUS_MAP[updated.status] || "INCOMPLETE";
    
    // Fallback de fecha para actualizaciones
    let currentPeriodEnd = updated.current_period_end
      ? new Date(updated.current_period_end * 1000)
      : null;

    if (!currentPeriodEnd || isNaN(currentPeriodEnd.getTime())) {
      currentPeriodEnd = new Date();
      if (planType === 'YEARLY') currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
      else currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    }

    const updatedBranch = await prisma.branch.update({
      where: { id: branchId },
      data: {
        plan: planType,
        subscriptionStatus,
        stripePriceId: priceId,
        currentPeriodEnd,
      },
      include: { owner: true } // Incluir dueño para el email
    });

    // Enviar correo de confirmación de cambio de plan (AWAIT)
    try {
      const amountPaid = planType === 'YEARLY' ? 5390 : 539;
      await sendPurchaseReceiptEmail(
        updatedBranch.owner?.email,
        updatedBranch.owner?.name || "Cliente",
        updatedBranch.name,
        planType,
        amountPaid,
        updatedBranch.currentPeriodEnd
      );
      console.log("✅ [EMAIL] Recibo de actualización enviado");
    } catch (emailErr) {
      console.error("❌ [EMAIL] Error en recibo de actualización:", emailErr.message);
    }

    return res.status(200).json({ branch: updatedBranch, status: subscriptionStatus });
  } catch (error) {
    console.error("Stripe update error:", error);
    return res.status(500).json({ message: "No se pudo actualizar la suscripcion" });
  }
};

export const cancelSubscription = async (req, res) => {
  if (!checkStripe(res)) return;
  const { branchId } = req.body || {};
  if (!branchId) {
    return res.status(400).json({ message: "branchId es requerido" });
  }

  try {
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch || !branch.stripeSubscriptionId) {
      return res.status(400).json({ message: "Sucursal sin suscripcion activa" });
    }

    const canceled = await stripe.subscriptions.update(branch.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
    const subscriptionStatus = "CANCELED"; // We force CANCELED status in our DB to indicate it won't renew
    const currentPeriodEnd = canceled.current_period_end
      ? new Date(canceled.current_period_end * 1000)
      : null;

    const updatedBranch = await prisma.branch.update({
      where: { id: branchId },
      data: {
        subscriptionStatus,
        currentPeriodEnd,
      },
    });

    return res.status(200).json({ branch: updatedBranch, status: subscriptionStatus });
  } catch (error) {
    console.error("Stripe cancel error:", error);
    return res.status(500).json({ message: "No se pudo cancelar la suscripcion" });
  }
};

