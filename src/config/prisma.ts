import { PrismaClient } from "../generated/prisma";

// Create Prisma client with error handling
let prisma: PrismaClient;

try {
  prisma = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
    errorFormat: "pretty",
  });

  // Test database connection
  prisma
    .$connect()
    .then(() => {
      console.log("✅ Database connected successfully");
    })
    .catch((error) => {
      console.error("❌ Database connection failed:", error);
      // Don't crash the app, just log the error
    });
} catch (error) {
  console.error("❌ Failed to create Prisma client:", error);
  // Create a fallback client
  prisma = new PrismaClient({
    log: ["error"],
    errorFormat: "pretty",
  });
}

export { prisma };
