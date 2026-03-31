import { Router } from "express";
import {
  createCheckoutSession,
  confirmSession,
  updateSubscription,
  cancelSubscription,
} from "../controllers/stripeController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/create-checkout-session", requireAuth, (req, res) => createCheckoutSession(req, res));
router.get("/confirm-session", requireAuth, (req, res) => confirmSession(req, res));
router.post("/update-subscription", requireAuth, (req, res) => updateSubscription(req, res));
router.post("/cancel-subscription", requireAuth, (req, res) => cancelSubscription(req, res));

export default router;
