import { Router } from "express";
import { getStream, listBranches } from "../controllers/branchesController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, (req, res) => listBranches(req, res));
router.get("/get-stream", (req, res) => getStream(req, res));

export default router;
