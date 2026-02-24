import { Router } from "express";
import { listStations, createStation } from "../controllers/stationsController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, (req, res) => listStations(req, res));
router.post("/", requireAuth, (req, res) => createStation(req, res));

export default router;
