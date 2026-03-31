import { Router } from "express";
import { getStream, listBranches, adminCreateBranch, updateContentProfile } from "../controllers/branchesController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, (req, res) => listBranches(req, res));
router.get("/get-stream", (req, res) => getStream(req, res));
router.patch("/:id/content-profile", requireAuth, (req, res) => updateContentProfile(req, res));

// Admin only
router.post("/admin-create", requireAuth, requireAdmin, (req, res) => adminCreateBranch(req, res));

export default router;
