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
  const { slug, branchId } = req.query;

  if (!slug && !branchId) {
    return res.status(400).json({ error: "Slug or branchId is required" });
  }

  try {
    const branch = await prisma.branch.findUnique({
      where: branchId ? { id: branchId } : { slug },
      include: { station: true },
    });

    if (!branch) {
      return res.status(404).json({ error: "Sucursal no encontrada" });
    }

    const isExpired = branch.currentPeriodEnd && new Date(branch.currentPeriodEnd) < new Date();
    const effectiveStatus = isExpired ? 'CANCELED' : branch.subscriptionStatus;

    return res.status(200).json({
      branchName: branch.name,
      stationName: branch.station?.name || 'Sin estacion',
      streamUrl: branch.station?.streamUrl || null,
      status: branch.status,
      slug: branch.slug,
      subscriptionStatus: effectiveStatus,
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
  const { userEmail, branchName, stationId, plan, streamingUrl, customAmount, customUnit } = req.body;

  if (!userEmail || !branchName || !plan) {
    return res.status(400).json({ message: "Faltan datos obligatorios (email, nombre sucursal, plan)" });
  }

  try {
    // 1. Buscar al usuario por email
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado con ese correo" });
    }

    // 2. Manejar la Estación/Streaming
    let finalStationId = stationId || null;

    if (streamingUrl && streamingUrl.trim() !== '') {
      try {
        const newStation = await prisma.station.create({
          data: {
            name: `Streaming: ${branchName}`,
            streamUrl: streamingUrl.trim(),
            active: true
          }
        });
        finalStationId = newStation.id;
      } catch (stationError) {
        console.error("Error creando estación:", stationError);
        // Continuamos aunque falle la estación, o podríamos lanzar error
      }
    }

    // 3. Generar un slug robusto
    let baseSlug = branchName
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos
      .replace(/[^a-z0-9]/g, '-') // Solo letras y números
      .replace(/-+/g, '-') // Quitar guiones duplicados
      .replace(/^-|-$/g, ''); // Quitar guiones al inicio/final

    let slug = baseSlug || `branch-${Math.floor(Math.random() * 10000)}`;
    
    // Verificar unicidad del slug
    const existingSlug = await prisma.branch.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    // 4. Definir fecha de fin
    const expiration = new Date();
    if (plan === 'YEARLY') {
      expiration.setFullYear(expiration.getFullYear() + 1);
    } else if (plan === 'MONTHLY') {
      expiration.setMonth(expiration.getMonth() + 1);
    } else if (plan === 'CUSTOM' && customAmount && customUnit) {
      const amount = parseInt(customAmount);
      if (customUnit === 'MINUTES') expiration.setMinutes(expiration.getMinutes() + amount);
      else if (customUnit === 'HOURS') expiration.setHours(expiration.getHours() + amount);
      else if (customUnit === 'DAYS') expiration.setDate(expiration.getDate() + amount);
      else expiration.setMonth(expiration.getMonth() + 1);
    } else {
      expiration.setMonth(expiration.getMonth() + 1);
    }

    // 5. Crear la sucursal
    const validPlan = (plan === 'YEARLY' || plan === 'MONTHLY') ? plan : 'MONTHLY';

    const branch = await prisma.branch.create({
      data: {
        name: branchName.trim(),
        slug,
        ownerId: user.id,
        stationId: finalStationId,
        plan: validPlan, 
        subscriptionStatus: 'ACTIVE',
        status: finalStationId ? 'Online' : 'Offline',
        currentPeriodEnd: expiration
      }
    });

    return res.status(201).json({ 
      message: "Sucursal activada exitosamente", 
      branch,
      listenUrl: `${process.env.APP_URL || 'http://localhost:5173'}/player/${slug}`
    });
  } catch (error) {
    console.error("CRITICAL ADMIN CREATE ERROR:", error);
    return res.status(500).json({ 
      message: "Error interno al crear sucursal",
      details: error.message 
    });
  }
};

/**
 * Permite al cliente actualizar sus datos de psicodemografía y anuncios
 */
export const updateContentProfile = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { targetAudience, brandAtmosphere, adRequirements } = req.body;

  try {
    const branch = await prisma.branch.findUnique({ where: { id } });
    if (!branch || branch.ownerId !== userId) {
      return res.status(403).json({ message: "No tienes permiso para editar esta sucursal" });
    }

    const updated = await prisma.branch.update({
      where: { id },
      data: {
        targetAudience,
        brandAtmosphere,
        adRequirements
      }
    });

    return res.status(200).json({ message: "Perfil de contenido actualizado", branch: updated });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar perfil de contenido" });
  }
};
