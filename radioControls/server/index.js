import "dotenv/config";
import prisma from "./lib/prisma.js";
import app from "./app.js";
const PORT = process.env.PORT || 3000;

app.get("/db-check", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    res.json({ ok: true, now: result?.[0]?.now || result });
  } catch (error) {
    res.status(500).json({ ok: false, error: "DB connection failed" });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
