
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const branchName = 'santa fe';
  console.log(`Buscando sucursal: ${branchName}...`);
  
  const branch = await prisma.branch.findFirst({
    where: {
      name: { contains: branchName, mode: 'insensitive' }
    }
  });

  if (!branch) {
    console.log("Sucursal no encontrada.");
    return;
  }

  console.log("Sucursal encontrada:", branch.name, branch.id);

  // Actualizar a Online si tiene estación, y poner fecha de vencimiento (1 mes si es null)
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const updated = await prisma.branch.update({
    where: { id: branch.id },
    data: {
      status: branch.stationId ? 'Online' : 'Offline',
      subscriptionStatus: 'ACTIVE',
      currentPeriodEnd: branch.currentPeriodEnd || nextMonth
    }
  });

  console.log("Sucursal actualizada correctamente:");
  console.log("Nombre:", updated.name);
  console.log("Estado:", updated.status);
  console.log("Suscripcion:", updated.subscriptionStatus);
  console.log("Expira:", updated.currentPeriodEnd);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
