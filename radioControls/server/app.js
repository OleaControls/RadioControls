import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import branchesRoutes from "./routes/branches.js";
import stationsRoutes from "./routes/stations.js";
import stripeRoutes from "./routes/stripe.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "radiocontrols-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/stations", stationsRoutes);
app.use("/api/stripe", stripeRoutes);

// En Vercel, el frontend es manejado por el builder estático.
// Solo activamos esto para entornos locales de producción si es necesario.
if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  const clientDist = path.resolve(__dirname, "..", "dist");
  app.use(express.static(clientDist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  // Manejador básico para rutas de API no encontradas
  app.use("/api/*", (req, res) => {
    res.status(404).json({ message: "API route not found" });
  });
}

export default app;
