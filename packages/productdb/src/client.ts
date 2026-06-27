import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

console.log("DATABASE_URL =", process.env.DATABASE_URL);

const connectionString = process.env.DATABASE_URL!;

console.log("CONNECTION_STRING =", connectionString);
// Create the connection pool
const pool = new pg.Pool({ connectionString });
// Instantiate the adapter using the pool
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({
  adapter,
});