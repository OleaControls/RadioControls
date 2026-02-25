import prisma from "../server/lib/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  const email = 'admin@radiocontrols.mx';
  const password = 'radioControls2026';
  const name = 'Administrador Olea';

  console.log('Verificando/Creando usuario administrador...');
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      isVerified: true
    },
    create: {
      email,
      password: hashedPassword,
      name,
      role: 'ADMIN',
      isVerified: true
    }
  });

  console.log('-----------------------------------');
  console.log('¡Operación Exitosa!');
  console.log('Usuario: ' + user.email);
  console.log('Rol: ' + user.role);
  console.log('Estado: Verificado');
  console.log('-----------------------------------');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
