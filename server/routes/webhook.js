import { Router } from "express";
import express from "express";
import { handleWebhook } from "../controllers/webhookController.js";

const router = Router();

// Stripe requiere el body en formato raw (Buffer) para verificar la firma
router.post("/", express.raw({ type: "application/json" }), handleWebhook);

export default router;
