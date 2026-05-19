import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getStream, listBranches, adminCreateBranch, updateContentProfile } from "../controllers/branchesController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

const streamLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiadas solicitudes al stream. Intenta más tarde." },
});

router.get("/", requireAuth, (req, res) => listBranches(req, res));
router.get("/get-stream", streamLimiter, (req, res) => getStream(req, res));
router.patch("/:id/content-profile", requireAuth, (req, res) => updateContentProfile(req, res));

// Admin only
router.post("/admin-create", requireAuth, requireAdmin, (req, res) => adminCreateBranch(req, res));

export default router;
