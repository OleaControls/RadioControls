import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  // Leer token desde la cookie httpOnly primero, luego del header Authorization como respaldo
  const cookieToken = req.cookies?.token;
  const header = req.headers.authorization || "";
  const headerToken = header.startsWith("Bearer ") ? header.substring(7) : null;
  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Acceso denegado: Solo administradores" });
  }
  next();
};
