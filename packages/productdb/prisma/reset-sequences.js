import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fallback to load DATABASE_URL from .env if not present in environment
if (!process.env.DATABASE_URL) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const envPath = path.resolve(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const matches = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
    if (matches && matches[1]) {
      process.env.DATABASE_URL = matches[1];
    }
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL is not set!");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔄 Resetting database auto-increment sequences...");

  try {
    // Reset auto-increment sequences for tables that have explicit IDs seeded
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Product"', 'id'), coalesce(max(id), 1)) FROM "Product";`);
    console.log("✅ Reset Product sequence.");

    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Category"', 'id'), coalesce(max(id), 1)) FROM "Category";`);
    console.log("✅ Reset Category sequence.");

    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"MainCategory"', 'id'), coalesce(max(id), 1)) FROM "MainCategory";`);
    console.log("✅ Reset MainCategory sequence.");

    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"ProductImages"', 'id'), coalesce(max(id), 1)) FROM "ProductImages";`);
    console.log("✅ Reset ProductImages sequence.");

    console.log("🎉 All database sequences reset successfully!");
  } catch (error) {
    console.error("❌ Failed to reset sequences:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Reset error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
