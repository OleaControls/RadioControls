import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  login,
  logout,
  me,
  register,
  verify,
  resendVerification,
  forgotPassword,
  resetPassword,
  adminCreateUser,
  updateProfile,
} from "../controllers/authController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiados intentos. Intenta de nuevo en 15 minutos." },
});

router.post("/login", authLimiter, (req, res) => login(req, res));
router.post("/logout", (req, res) => logout(req, res));
router.get("/me", requireAuth, (req, res) => me(req, res));
router.post("/register", authLimiter, (req, res) => register(req, res));
router.post("/verify", (req, res) => verify(req, res));
router.post("/resend-verification", authLimiter, (req, res) => resendVerification(req, res));
router.post("/forgot-password", authLimiter, (req, res) => forgotPassword(req, res));
router.post("/reset-password", (req, res) => resetPassword(req, res));
router.patch("/update-profile", requireAuth, (req, res) => updateProfile(req, res));

// Solo Admin
router.post("/admin-create-user", requireAuth, requireAdmin, (req, res) => adminCreateUser(req, res));

export default router;
