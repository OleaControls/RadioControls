import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS, // No es tu contraseña normal, es una "App Password"
  },
});

/**
 * Envía el código de verificación para el registro
 */
export const sendVerificationEmail = async (email, name, code) => {
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

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error enviando email de verificación:', error);
    return false;
  }
};

/**
 * Envía el enlace de recuperación de contraseña
 */
export const sendResetPasswordEmail = async (email, token) => {
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
        <p>Si no solicitaste este cambio, ignora este correo. El enlace expirará en 1 hora.</p>
        <p style="font-size: 12px; color: #888;">Si el botón no funciona, copia y pega este enlace: <br/> ${resetUrl}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">RadiOlea Controls - Soporte Técnico</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error enviando email de recuperación:', error);
    return false;
  }
};
