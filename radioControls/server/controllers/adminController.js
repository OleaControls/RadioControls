import prisma from "../lib/prisma.js";

/**
 * Lista todos los usuarios (Solo para Admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: { select: { branches: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

/**
 * Lista todas las sucursales del sistema (Solo para Admin)
 */
export const getAllBranches = async (req, res) => {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        owner: { select: { name: true, email: true, companyName: true } },
        station: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(branches);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener sucursales" });
  }
};

/**
 * Asigna una estación (Stream Link) a una sucursal
 */
export const assignStationToBranch = async (req, res) => {
  const { branchId, stationId } = req.body;

  try {
    const branch = await prisma.branch.update({
      where: { id: branchId },
      data: { stationId },
      include: { station: true }
    });
    return res.status(200).json({ message: "Estación asignada correctamente", branch });
  } catch (error) {
    return res.status(500).json({ message: "Error al asignar estación" });
  }
};

/**
 * Crea una estación a partir de una URL y la asigna a la sucursal
 */
export const assignCustomUrl = async (req, res) => {
  const { branchId, streamingUrl } = req.body;

  if (!branchId || !streamingUrl) {
    return res.status(400).json({ message: "branchId y streamingUrl son requeridos" });
  }

  try {
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) return res.status(404).json({ message: "Sucursal no encontrada" });

    // 1. Crear la estación
    const station = await prisma.station.create({
      data: {
        name: `Stream: ${branch.name}`,
        streamUrl: streamingUrl,
        active: true
      }
    });

    // 2. Vincular a la sucursal y ponerla Online
    const updatedBranch = await prisma.branch.update({
      where: { id: branchId },
      data: { 
        stationId: station.id,
        status: 'Online'
      },
      include: { owner: true, station: true }
    });

    return res.status(200).json({ message: "Streaming vinculado", branch: updatedBranch });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al asignar URL personalizada" });
  }
};

/**
 * Agrega tiempo extra o compensación a una sucursal (Días, Horas, Minutos)
 */
export const compensateBranch = async (req, res) => {
  const { branchId, amount, unit, reason } = req.body;

  if (!branchId || !amount || !unit) {
    return res.status(400).json({ message: "Faltan datos requeridos (branchId, amount, unit)" });
  }

  try {
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) return res.status(404).json({ message: "Sucursal no encontrada" });

    // Determinar la fecha base: Si ya expiró, usamos 'ahora'. Si no, usamos 'currentPeriodEnd'.
    let baseDate = branch.currentPeriodEnd && branch.currentPeriodEnd > new Date() 
      ? new Date(branch.currentPeriodEnd) 
      : new Date();

    const newDate = new Date(baseDate);

    switch (unit) {
      case 'MINUTES':
        newDate.setMinutes(newDate.getMinutes() + parseInt(amount));
        break;
      case 'HOURS':
        newDate.setHours(newDate.getHours() + parseInt(amount));
        break;
      case 'DAYS':
        newDate.setDate(newDate.getDate() + parseInt(amount));
        break;
      case 'MONTHS':
        newDate.setMonth(newDate.getMonth() + parseInt(amount));
        break;
      case 'YEARS':
        newDate.setFullYear(newDate.getFullYear() + parseInt(amount));
        break;
      default:
        return res.status(400).json({ message: "Unidad de tiempo no válida" });
    }

    const updatedBranch = await prisma.branch.update({
      where: { id: branchId },
      data: {
        currentPeriodEnd: newDate,
        subscriptionStatus: 'ACTIVE', // Reactivamos si estaba bloqueada
        status: branch.stationId ? 'Online' : 'Offline'
      },
      include: { owner: true, station: true }
    });

    return res.status(200).json({ 
      message: `Compensación aplicada: +${amount} ${unit}`, 
      branch: updatedBranch 
    });
  } catch (error) {
    console.error("Error en compensación:", error);
    return res.status(500).json({ message: "Error al aplicar compensación" });
  }
};
