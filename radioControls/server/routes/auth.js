import { Router } from "express";
import {
  login,
  register,
  verify,
  resendVerification,
  forgotPassword,
  resetPassword,
  adminCreateUser,
} from "../controllers/authController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/login", (req, res) => login(req, res));
router.post("/register", (req, res) => register(req, res));
router.post("/verify", (req, res) => verify(req, res));
router.post("/resend-verification", (req, res) => resendVerification(req, res));
router.post("/forgot-password", (req, res) => forgotPassword(req, res));
router.post("/reset-password", (req, res) => resetPassword(req, res));

// Admin only
router.post("/admin-create-user", requireAuth, requireAdmin, (req, res) => adminCreateUser(req, res));

export default router;
