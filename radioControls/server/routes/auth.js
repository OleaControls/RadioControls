import { Router } from "express";
import {
  login,
  register,
  verify,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = Router();

router.post("/login", (req, res) => login(req, res));
router.post("/register", (req, res) => register(req, res));
router.post("/verify", (req, res) => verify(req, res));
router.post("/forgot-password", (req, res) => forgotPassword(req, res));
router.post("/reset-password", (req, res) => resetPassword(req, res));

export default router;
