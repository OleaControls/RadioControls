import { Router } from "express";
import { 
  getAllUsers, 
  getAllBranches, 
  assignStationToBranch, 
  assignCustomUrl, 
  compensateBranch,
  getAuditLogs,
  getSystemHealth,
  deleteUser,
  deleteStation
} from "../controllers/adminController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/users", requireAuth, requireAdmin, getAllUsers);
router.get("/branches", requireAuth, requireAdmin, getAllBranches);
router.patch("/assign-station", requireAuth, requireAdmin, assignStationToBranch);
router.patch("/assign-custom-url", requireAuth, requireAdmin, assignCustomUrl);
router.patch("/compensate", requireAuth, requireAdmin, compensateBranch);

router.get("/audit-logs", requireAuth, requireAdmin, getAuditLogs);
router.get("/health", requireAuth, requireAdmin, getSystemHealth);
router.delete("/users/:id", requireAuth, requireAdmin, deleteUser);
router.delete("/stations/:id", requireAuth, requireAdmin, deleteStation);

export default router;
