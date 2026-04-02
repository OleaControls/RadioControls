import prisma from "../lib/prisma.js";
import { logAdminAction } from "../lib/auditLog.js";

/**
 * Lista todos los usuarios (Solo para Admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyName: true,
        createdAt: true,
        _count: { select: { branches: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error getAllUsers:", error);
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
    console.error("Error getAllBranches:", error);
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
    logAdminAction(req.user.userId, req.user.name, "ASSIGN_STATION", { branchId, stationId });
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

    const station = await prisma.station.create({
      data: {
        name: `Stream: ${branch.name}`,
        streamUrl: streamingUrl,
        active: true
      }
    });

    const updatedBranch = await prisma.branch.update({
      where: { id: branchId },
      data: { 
        stationId: station.id,
        status: 'Online'
      },
      include: { owner: true, station: true }
    });

    logAdminAction(req.user.userId, req.user.name, "ASSIGN_CUSTOM_URL", { branchId, streamingUrl });
    return res.status(200).json({ message: "Streaming vinculado", branch: updatedBranch });
  } catch (error) {
    return res.status(500).json({ message: "Error al asignar URL personalizada" });
  }
};

/**
 * Agrega tiempo extra o compensación a una sucursal
 */
export const compensateBranch = async (req, res) => {
  const { branchId, amount, unit, reason } = req.body;

  try {
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) return res.status(404).json({ message: "Sucursal no encontrada" });

    let baseDate = branch.currentPeriodEnd && branch.currentPeriodEnd > new Date() 
      ? new Date(branch.currentPeriodEnd) 
      : new Date();

    const newDate = new Date(baseDate);
    const val = parseInt(amount);

    if (unit === 'MINUTES') newDate.setMinutes(newDate.getMinutes() + val);
    else if (unit === 'HOURS') newDate.setHours(newDate.getHours() + val);
    else if (unit === 'DAYS') newDate.setDate(newDate.getDate() + val);
    else if (unit === 'MONTHS') newDate.setMonth(newDate.getMonth() + val);

    const updatedBranch = await prisma.branch.update({
      where: { id: branchId },
      data: {
        currentPeriodEnd: newDate,
        subscriptionStatus: 'ACTIVE',
        status: branch.stationId ? 'Online' : 'Offline'
      },
      include: { owner: true, station: true }
    });

    logAdminAction(req.user.userId, req.user.name, "COMPENSATE_BRANCH", { branchId, amount, unit, reason });
    return res.status(200).json({ message: "Compensación aplicada", branch: updatedBranch });
  } catch (error) {
    return res.status(500).json({ message: "Error al aplicar compensación" });
  }
};

/**
 * Obtiene los logs de auditoría
 */
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    return res.status(200).json(logs);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener logs" });
  }
};

/**
 * Verifica la salud del sistema
 */
export const getSystemHealth = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      status: "OPTIMAL",
      database: "CONNECTED",
      uptime: process.uptime(),
      memory: {
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + "MB"
      },
      version: "2.4.0-Stable"
    });
  } catch (error) {
    return res.status(500).json({ status: "ERROR" });
  }
};

/**
 * Elimina un usuario
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    logAdminAction(req.user.userId, req.user.name, "DELETE_USER", { userId: id });
    return res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

/**
 * Elimina una estación
 */
export const deleteStation = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.station.delete({ where: { id } });
    logAdminAction(req.user.userId, req.user.name, "DELETE_STATION", { stationId: id });
    return res.status(200).json({ message: "Estación eliminada" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar estación" });
  }
};
