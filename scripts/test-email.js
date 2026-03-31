
import 'dotenv/config';
import { sendPurchaseReceiptEmail } from '../server/lib/email.js';

async function test() {
  console.log("🚀 Iniciando prueba de correo...");
  console.log("Configuración detectada:");
  console.log("- GMAIL_USER:", process.env.GMAIL_USER);
  console.log("- GMAIL_APP_PASS:", process.env.GMAIL_APP_PASS ? "Configurada (********)" : "FALTANTE");

  const testEmail = process.env.GMAIL_USER; // Enviar a ti mismo
  const testName = "Admin Test";
  const branchName = "Sucursal de Prueba";
  const planType = "MONTHLY";
  const amount = 539;
  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + 1);

  try {
    const success = await sendPurchaseReceiptEmail(testEmail, testName, branchName, planType, amount, renewalDate);
    if (success) {
      console.log("✅ PRUEBA EXITOSA: El correo debería llegar a", testEmail, "en unos segundos.");
    } else {
      console.log("❌ PRUEBA FALLIDA: El servidor no pudo enviar el correo. Revisa si tu GMAIL_APP_PASS es correcta y si tienes habilitada la verificación en dos pasos.");
    }
  } catch (error) {
    console.error("💥 ERROR CRÍTICO:", error);
  }
}

test();
