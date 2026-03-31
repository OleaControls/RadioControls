import { Router } from "express";
import { listIncidents, createIncident, updateIncidentStatus } from "../controllers/incidentsController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Rutas autenticadas
router.get("/", requireAuth, (req, res) => listIncidents(req, res));
router.post("/", requireAuth, (req, res) => createIncident(req, res));

// Rutas solo Admin
router.patch("/:id/status", requireAuth, requireAdmin, (req, res) => updateIncidentStatus(req, res));

export default router;
