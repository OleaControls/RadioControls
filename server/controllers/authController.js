import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import crypto from "crypto";
import { sendVerificationEmail, sendResetPasswordEmail } from "../lib/email.js";

const CODE_EXPIRATION_MINUTES = 5;

// Opciones de la cookie de sesión — httpOnly previene acceso desde JavaScript
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Faltan email o contraseña" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _password, ...userWithoutPassword } = user;
    // Establecer el token en una cookie httpOnly en lugar de exponerlo en el cuerpo
    res.cookie("token", token, COOKIE_OPTIONS);
    return res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Cierra la sesión del usuario eliminando la cookie de autenticación
 */
export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Sesión cerrada exitosamente" });
};

/**
 * Retorna los datos del usuario autenticado según la cookie de sesión
 */
export const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      omit: { password: true },
    });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error al obtener sesión:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Faltan nombre, email o contraseña" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Ya existe un usuario con ese email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + CODE_EXPIRATION_MINUTES * 60000);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationCode,
        verificationExpires,
        isVerified: false,
      },
    });

    await sendVerificationEmail(email, name, verificationCode);

    const { password: _password, ...userWithoutPassword } = user;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Permite a un ADMIN crear usuarios (Admin, Client, Staff) directamente
 */
export const adminCreateUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role, // ADMIN, CLIENT, STAFF
        isVerified: true, // Se marca como verificado por defecto al ser creado por admin
      },
    });

    const { password: _password, ...userWithoutPassword } = user;
    return res.status(201).json({ message: "Usuario creado exitosamente", user: userWithoutPassword });
  } catch (error) {
    console.error("Admin create user error:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const resendVerification = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email es requerido" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    if (user.isVerified) return res.status(400).json({ message: "La cuenta ya está verificada" });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + CODE_EXPIRATION_MINUTES * 60000);

    await prisma.user.update({
      where: { email },
      data: { 
        verificationCode, 
        verificationExpires 
      },
    });

    await sendVerificationEmail(email, user.name, verificationCode);
    return res.status(200).json({ message: "Nuevo código enviado" });
  } catch (error) {
    console.error("Resend error:", error);
    return res.status(500).json({ message: "Error al reenviar código" });
  }
};

export const verify = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "Falta el email o el codigo de verificacion" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "Cuenta ya verificada" });
    }

    // Verificar si el código coincide
    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "El código de verificación es incorrecto" });
    }

    // Verificar si ha expirado
    if (user.verificationExpires && user.verificationExpires < new Date()) {
      return res.status(400).json({ message: "El código ha expirado. Solicita uno nuevo." });
    }

    await prisma.user.update({
      where: { email },
      data: { isVerified: true, verificationCode: null, verificationExpires: null },
    });

    return res.status(200).json({ message: "Cuenta verificada exitosamente" });
  } catch (error) {
    console.error("Error de verificacion:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "El email es obligatorio" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(200).json({ message: "Si el correo existe, se ha enviado un enlace de recuperacion" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expires = new Date(Date.now() + CODE_EXPIRATION_MINUTES * 60000);

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });

    await sendResetPasswordEmail(email, token);

    return res.status(200).json({ message: "Si el correo existe, se ha enviado un enlace de recuperacion" });
  } catch (error) {
    console.error("Error en recuperacion:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token y nueva contrasena son obligatorios" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() }, // Ya incluye la verificación de expiración
      },
    });

    if (!user) {
      return res.status(400).json({ message: "El token es inválido o ha expirado" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return res.status(200).json({ message: "Contrasena actualizada exitosamente" });
  } catch (error) {
    console.error("Error al resetear contrasena:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Actualiza el perfil del usuario
 */
export const updateProfile = async (req, res) => {
  const { userId } = req.user; // Viene del token JWT
  const { name, email, companyName, phoneNumber } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Generar Custom ID si no tiene uno
    let customerCustomId = user.customerCustomId;
    if (!customerCustomId && (name || user.name)) {
      const baseName = name || user.name || "USR";
      const prefix = baseName.substring(0, 3).toUpperCase();
      const random = Math.floor(1000 + Math.random() * 9000);
      customerCustomId = `${prefix}-${random}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        email: email || undefined,
        companyName: companyName || undefined,
        phoneNumber: phoneNumber || undefined,
        customerCustomId: customerCustomId
      }
    });

    const { password: _password, ...userWithoutPassword } = updatedUser;
    return res.status(200).json({ 
      message: "Perfil actualizado exitosamente", 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error("Update profile error:", error);
    if (error.code === 'P2002') {
      return res.status(409).json({ message: "El correo ya está en uso" });
    }
    return res.status(500).json({ message: "Error al actualizar el perfil" });
  }
};
