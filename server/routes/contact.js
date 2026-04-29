import express from 'express';
import { sendContactFormEmail } from '../lib/email.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, company, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Nombre, email y mensaje son requeridos.' });
  }

  const sent = await sendContactFormEmail({ name, company, email, message });

  if (sent) {
    return res.json({ ok: true, message: 'Mensaje enviado correctamente.' });
  } else {
    return res.status(500).json({ ok: false, message: 'No se pudo enviar el mensaje. Intenta más tarde.' });
  }
});

export default router;
