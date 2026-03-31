import { Router } from "express";
import { listStations, createStation } from "../controllers/stationsController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, (req, res) => listStations(req, res));
router.post("/", requireAuth, requireAdmin, (req, res) => createStation(req, res));

export default router;
