import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log('DATABASE_URL:', connectionString ? 'Configurada' : 'No configurada');
    console.log('Intentando conectar a la base de datos con adaptador...');
    const result = await prisma.$queryRaw`SELECT 1+1 as result`;
    console.log('Conexión exitosa:', result);
  } catch (e) {
    console.error('Error al conectar a la base de datos:', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
