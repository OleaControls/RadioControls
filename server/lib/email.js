import nodemailer from 'nodemailer';

// Inicialización segura del transporte
const transporter = (process.env.GMAIL_USER && process.env.GMAIL_APP_PASS)
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    })
  : null;

/**
 * Envía un correo con reintentos automáticos y backoff exponencial.
 * Máximo 3 intentos: 0s, 1s, 2s de espera entre cada uno.
 */
const sendWithRetry = async (mailOptions, maxAttempts = 3) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      if (attempt === maxAttempts) {
        console.error(`Error enviando email tras ${maxAttempts} intentos:`, error);
        return false;
      }
      // Espera exponencial entre intentos
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt - 1)));
    }
  }
};

/**
 * Envía el código de verificación para el registro
 */
export const sendVerificationEmail = async (email, name, code) => {
  if (!transporter) {
    console.warn("⚠️ Correo no enviado: Faltan credenciales de GMAIL en variables de entorno.");
    console.log(`DEBUG - Código para ${email}: ${code}`);
    return false;
  }

  const mailOptions = {
    from: `"RadiOlea Controls" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Tu código de verificación: ${code}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #00f3ff; text-align: center;">¡Bienvenido a RadiOlea Controls!</h2>
        <p>Hola <strong>${name}</strong>,</p>
        <p>Gracias por registrarte. Para completar tu cuenta, por favor usa el siguiente código de verificación:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
          <h1 style="letter-spacing: 10px; font-size: 40px; margin: 0;">${code}</h1>
        </div>
        <p>Este código expirará pronto. Si no creaste esta cuenta, puedes ignorar este correo.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">RadiOlea Controls - Ingeniería de Audio Premium</p>
      </div>
    `,
  };

  return sendWithRetry(mailOptions);
};

/**
 * Envía el enlace de recuperación de contraseña
 */
export const sendResetPasswordEmail = async (email, token) => {
  if (!transporter) {
    console.warn("⚠️ Correo no enviado: Faltan credenciales de GMAIL en variables de entorno.");
    return false;
  }

  const resetUrl = `${process.env.APP_URL || 'http://localhost:5173'}/reset-password/${token}`;

  const mailOptions = {
    from: `"RadiOlea Controls" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Recupera tu contraseña - RadiOlea Controls",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #00f3ff; text-align: center;">Recuperación de Contraseña</h2>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para continuar:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #00f3ff; color: #000; padding: 15px 25px; text-decoration: none; font-weight: bold; border-radius: 10px; display: inline-block;">RESTABLECER CONTRASEÑA</a>
        </div>
        <p>Si no solicitaste este cambio, ignora este correo. El enlace expirará en 5 minutos.</p>
        <p style="font-size: 12px; color: #888;">Si el botón no funciona, copia y pega este enlace: <br/> ${resetUrl}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">RadiOlea Controls - Soporte Técnico</p>
      </div>
    `,
  };

  return sendWithRetry(mailOptions);
};

/**
 * Envía el comprobante de compra (Recibo)
 */
export const sendPurchaseReceiptEmail = async (email, name, branchName, planType, amount, renewalDate) => {
  if (!transporter) {
    console.warn("⚠️ Correo no enviado: Faltan credenciales de GMAIL.");
    return false;
  }

  const formattedDate = new Date(renewalDate).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const mailOptions = {
    from: `"RadiOlea Controls" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `¡Gracias por tu compra! - Recibo de ${branchName}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 0; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
        <!-- Header con gradiente -->
        <div style="background: linear-gradient(135deg, #001a4d 0%, #002366 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #00f3ff; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">RadiOlea Controls</h1>
          <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.8; font-weight: 300;">Ingeniería de Audio Premium</p>
        </div>

        <div style="padding: 40px 30px;">
          <h2 style="color: #333; margin-top: 0;">¡Gracias por tu confianza, ${name}!</h2>
          <p style="color: #666; line-height: 1.6;">Tu pago ha sido procesado exitosamente. Tu sucursal ya cuenta con el mejor sistema de audio distribuido del mercado.</p>

          <!-- Detalles del Pedido -->
          <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #eee;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Sucursal</td>
                <td style="padding: 10px 0; color: #333; font-weight: bold; text-align: right;">${branchName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Paquete</td>
                <td style="padding: 10px 0; color: #333; font-weight: bold; text-align: right;">${planType === 'YEARLY' ? 'Profesional Anual' : 'Básico Mensual'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Monto Pagado</td>
                <td style="padding: 10px 0; color: #002366; font-weight: 900; text-align: right; font-size: 18px;">$${amount.toLocaleString('es-MX')} MXN</td>
              </tr>
              <tr style="border-top: 1px solid #ddd;">
                <td style="padding: 15px 0 0 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Próxima Renovación</td>
                <td style="padding: 15px 0 0 0; color: #002366; font-weight: bold; text-align: right;">${formattedDate}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.APP_URL || 'http://localhost:5173'}/dashboard" style="background-color: #00f3ff; color: #000000; padding: 18px 35px; text-decoration: none; font-weight: bold; border-radius: 12px; display: inline-block; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(0,243,255,0.3);">Ir a mi Panel de Control</a>
          </div>

          <p style="color: #999; font-size: 13px; text-align: center; line-height: 1.5;">
            Si necesitas ayuda para configurar tu equipo o asignar un stream, nuestro equipo técnico está disponible 24/7 vía WhatsApp o Email.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f1f1; padding: 20px; text-align: center;">
          <p style="font-size: 11px; color: #aaa; margin: 0;">&copy; 2026 RadiOlea Controls. Todos los derechos reservados.</p>
          <p style="font-size: 11px; color: #aaa; margin: 5px 0 0 0;">Este es un comprobante automático de pago.</p>
        </div>
      </div>
    `,
  };

  return sendWithRetry(mailOptions);
};
