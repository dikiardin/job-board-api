import { PrismaClient } from "../generated/prisma";
import { hashPassword } from "../utils/hashPassword";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log("Creating admin user...");
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@company.com" }
    });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      return;
    }

    // Hash password
    const passwordHash = await hashPassword("admin123");

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: "Admin Company",
        email: "admin@company.com",
        passwordHash,
        role: "ADMIN",
        isVerified: true, // Skip email verification for demo
      }
    });

    console.log("Admin user created:", admin);

    // Create company for admin
    const company = await prisma.company.create({
      data: {
        name: "Demo Company",
        email: "admin@company.com",
        phone: "+6281234567890",
        location: "Jakarta, Indonesia",
        description: "A demo company for testing purposes",
        website: "https://democompany.com",
        adminId: admin.id,
      }
    });

    console.log("Company created:", company);

    console.log("✅ Admin setup completed!");
    console.log("Email: admin@company.com");
    console.log("Password: admin123");
    
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
