import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@radiocontrols.mx';
  const password = 'password123';
  const name = 'Admin Demo';

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('El usuario demo ya existe.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'ADMIN',
    },
  });

  console.log('-----------------------------------');
  console.log('¡Usuario Demo Creado con Éxito!');
  console.log('Email: ' + email);
  console.log('Password: ' + password);
  console.log('-----------------------------------');
}

main()
  .catch((e) => {
    console.error('Error creando el usuario:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
