import Stripe from "stripe";
import prisma from "../lib/prisma.js";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const STATUS_MAP = {
  active: "ACTIVE",
  canceled: "CANCELED",
  past_due: "PAST_DUE",
  incomplete: "INCOMPLETE",
  incomplete_expired: "INCOMPLETE",
  unpaid: "PAST_DUE",
  trialing: "ACTIVE",
};

export const handleWebhook = async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ message: "Stripe no configurado" });
  }

  const sig = req.headers["stripe-signature"];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || secret.startsWith("whsec_REEMPLAZA")) {
    console.warn("⚠️ STRIPE_WEBHOOK_SECRET no configurado. Webhook ignorado.");
    return res.status(200).json({ received: true });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  const obj = event.data?.object;

  try {
    switch (event.type) {
      case "customer.subscription.updated": {
        const status = STATUS_MAP[obj.status] || "INCOMPLETE";
        const periodEnd = obj.current_period_end
          ? new Date(obj.current_period_end * 1000)
          : null;

        await prisma.branch.updateMany({
          where: { stripeSubscriptionId: obj.id },
          data: { subscriptionStatus: status, currentPeriodEnd: periodEnd },
        });
        console.log(`[Webhook] subscription.updated → ${obj.id} → ${status}`);
        break;
      }

      case "customer.subscription.deleted": {
        await prisma.branch.updateMany({
          where: { stripeSubscriptionId: obj.id },
          data: { subscriptionStatus: "CANCELED" },
        });
        console.log(`[Webhook] subscription.deleted → ${obj.id}`);
        break;
      }

      case "invoice.payment_failed": {
        const subId = obj.subscription;
        if (subId) {
          await prisma.branch.updateMany({
            where: { stripeSubscriptionId: subId },
            data: { subscriptionStatus: "PAST_DUE" },
          });
          console.log(`[Webhook] payment_failed → sub ${subId}`);
        }
        break;
      }

      case "invoice.paid": {
        const subId = obj.subscription;
        if (subId) {
          // Reactivar si estaba en PAST_DUE tras pago exitoso
          const sub = await stripe.subscriptions.retrieve(subId);
          const periodEnd = sub.current_period_end
            ? new Date(sub.current_period_end * 1000)
            : null;
          await prisma.branch.updateMany({
            where: { stripeSubscriptionId: subId },
            data: { subscriptionStatus: "ACTIVE", currentPeriodEnd: periodEnd },
          });
          console.log(`[Webhook] invoice.paid → sub ${subId} reactivada`);
        }
        break;
      }

      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({ message: "Error procesando webhook" });
  }
};
