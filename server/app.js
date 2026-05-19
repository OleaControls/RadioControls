import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import branchesRoutes from "./routes/branches.js";
import stationsRoutes from "./routes/stations.js";
import stripeRoutes from "./routes/stripe.js";
import incidentsRoutes from "./routes/incidents.js";
import adminRoutes from "./routes/admin.js";
import webhookRoutes from "./routes/webhook.js";
import contactRoutes from "./routes/contact.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Orígenes permitidos: en producción se requiere CORS_ORIGIN explícito
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

if (process.env.NODE_ENV === "production" && !process.env.CORS_ORIGIN) {
  console.warn("⚠️  CORS_ORIGIN no está configurado en producción. Define esta variable de entorno.");
}

// El webhook de Stripe necesita body raw — debe ir ANTES de express.json()
app.use("/api/stripe/webhook", webhookRoutes);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(morgan("dev"));

const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiadas solicitudes. Intenta de nuevo en 15 minutos." },
});
app.use("/api/", globalApiLimiter);

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "radiocontrols-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/stations", stationsRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/incidents", incidentsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

// En Vercel el frontend es manejado por el builder estático.
// Solo se activa para entornos locales de producción.
if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  const clientDist = path.resolve(__dirname, "..", "dist");
  app.use(express.static(clientDist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  app.use("/api/*", (req, res) => {
    res.status(404).json({ message: "Ruta de API no encontrada" });
  });
}

export default app;
