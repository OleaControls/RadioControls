import prisma from "../lib/prisma.js";

/**
 * Lista incidentes. Si es ADMIN, todos. Si es CLIENT, solo los suyos.
 */
export const listIncidents = async (req, res) => {
  const { userId, role } = req.user;

  try {
    // Verificamos si el modelo existe en la instancia actual de prisma
    if (!prisma.incident) {
      console.error("CRÍTICO: El modelo 'incident' no existe en el cliente de Prisma.");
      return res.status(500).json({ message: "Error de configuración de base de datos" });
    }

    const where = role === "ADMIN" ? {} : { userId };
    const incidents = await prisma.incident.findMany({
      where,
      include: {
        user: {
          select: { name: true, email: true, companyName: true }
        },
        branch: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return res.status(200).json(incidents);
  } catch (error) {
    console.error("Error listing incidents:", error);
    return res.status(500).json({ message: "Error al cargar incidentes" });
  }
};

/**
 * Crea un nuevo incidente
 */
export const createIncident = async (req, res) => {
  const { userId } = req.user;
  const { title, description, branchId } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Título y descripción son obligatorios" });
  }

  try {
    const incident = await prisma.incident.create({
      data: {
        title,
        description,
        userId,
        branchId: branchId || null,
        status: "PENDING"
      },
      include: {
        branch: { select: { name: true } }
      }
    });
    return res.status(201).json(incident);
  } catch (error) {
    console.error("Error creating incident:", error);
    return res.status(500).json({ message: "Error al crear el reporte" });
  }
};

/**
 * Actualiza el estado de un incidente (Solo ADMIN)
 */
export const updateIncidentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Estado requerido" });

  try {
    const incident = await prisma.incident.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { name: true, email: true } },
        branch: { select: { name: true } }
      }
    });
    return res.status(200).json(incident);
  } catch (error) {
    console.error("Error updating incident:", error);
    return res.status(500).json({ message: "Error al actualizar estado" });
  }
};
