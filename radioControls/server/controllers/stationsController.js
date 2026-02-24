import prisma from "../lib/prisma.js";

export const listStations = async (req, res) => {
  try {
    const stations = await prisma.station.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(stations);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener estaciones" });
  }
};

export const createStation = async (req, res) => {
  const { name, streamUrl } = req.body;
  try {
    const newStation = await prisma.station.create({
      data: { name, streamUrl },
    });
    return res.status(201).json(newStation);
  } catch (error) {
    return res.status(500).json({ error: "Error al crear estacion" });
  }
};

