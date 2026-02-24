import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import crypto from "crypto";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _password, ...userWithoutPassword } = user;
    return res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing name, email, or password" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationCode,
        isVerified: false,
      },
    });

    const { password: _password, ...userWithoutPassword } = user;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
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

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "El codigo de verificacion es incorrecto" });
    }

    await prisma.user.update({
      where: { email },
      data: { isVerified: true, verificationCode: null },
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
    const expires = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });

    const resetPath = `/reset-password/${token}`;
    console.log(`Enlace de recuperacion para ${email}: ${resetPath}`);

    if (process.env.NODE_ENV !== "production") {
      return res.status(200).json({
        message: "Si el correo existe, se ha enviado un enlace de recuperacion",
        resetPath,
      });
    }

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
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "El token es invalido o ha expirado" });
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
