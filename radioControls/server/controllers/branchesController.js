import prisma from "../lib/prisma.js";

export const listBranches = async (req, res) => {
  const { ownerId } = req.query;
  if (!ownerId) {
    return res.status(400).json({ message: "ownerId es requerido" });
  }

  try {
    const branches = await prisma.branch.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
      include: { station: true },
    });
    return res.status(200).json(branches);
  } catch (error) {
    console.error("Error al obtener sucursales:", error);
    return res.status(500).json({ message: "Error al obtener sucursales" });
  }
};

export const getStream = async (req, res) => {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: "Slug is required" });
  }

  try {
    const branch = await prisma.branch.findUnique({
      where: { slug },
      include: { station: true },
    });

    if (!branch) {
      return res.status(404).json({ error: "Sucursal no encontrada" });
    }

    if (!branch.station) {
      return res.status(404).json({ error: "Esta sucursal no tiene una estacion asignada" });
    }

    return res.status(200).json({
      branchName: branch.name,
      stationName: branch.station.name,
      streamUrl: branch.station.streamUrl,
      status: branch.status,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

