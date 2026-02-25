import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@radiocontrols.mx';
  const password = 'radioControls2026';
  const name = 'Administrador Olea';

  console.log('Verificando si el usuario ya existe...');
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('El usuario ya existe. Actualizando contraseña...');
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true
      },
    });
    console.log('Usuario actualizado correctamente.');
  } else {
    console.log('Creando nuevo usuario administrador...');
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
        isVerified: true
      },
    });
    console.log('Usuario administrador creado con éxito.');
  }

  console.log('-----------------------------------');
  console.log('Credenciales de acceso:');
  console.log('Email: ' + email);
  console.log('Password: ' + password);
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
