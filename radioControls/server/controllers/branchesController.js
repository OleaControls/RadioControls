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

/**
 * Permite a un ADMIN crear una sucursal manualmente para un cliente
 */
export const adminCreateBranch = async (req, res) => {
  const { userEmail, branchName, stationId, plan } = req.body;

  if (!userEmail || !branchName || !plan) {
    return res.status(400).json({ message: "Faltan datos obligatorios (email, nombre sucursal, plan)" });
  }

  try {
    // 1. Buscar al usuario por email
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado con ese correo" });
    }

    // 2. Generar un slug único basado en el nombre
    let slug = branchName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const existingSlug = await prisma.branch.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    // 3. Definir fecha de fin (si es anual +1 año, si es mensual +1 mes)
    const expiration = new Date();
    if (plan === 'YEARLY') expiration.setFullYear(expiration.getFullYear() + 1);
    else expiration.setMonth(expiration.getMonth() + 1);

    // 4. Crear la sucursal
    const branch = await prisma.branch.create({
      data: {
        name: branchName,
        slug,
        ownerId: user.id,
        stationId: stationId || null,
        plan: plan,
        subscriptionStatus: 'ACTIVE',
        status: 'Online',
        currentPeriodEnd: expiration
      }
    });

    return res.status(201).json({ message: "Sucursal activada exitosamente", branch });
  } catch (error) {
    console.error("Error en activación manual:", error);
    return res.status(500).json({ message: "Error al activar sucursal manualmente" });
  }
};
