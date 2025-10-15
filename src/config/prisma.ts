import { PrismaClient } from "../generated/prisma";

// Create Prisma client with minimal configuration for testing
let prisma: PrismaClient;

try {
  prisma = new PrismaClient({
    log: ["error"], // Minimal logging
  });
  console.log("✅ Prisma client created successfully");
} catch (error) {
  console.error("❌ Failed to create Prisma client:", error);
  // Create a fallback client
  prisma = new PrismaClient();
}

export { prisma };
