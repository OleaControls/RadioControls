import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("USER:PASSWORD")) {
  throw new Error(
    "DATABASE_URL is missing or still using the placeholder. Set a real Postgres URL in .env."
  );
}

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
