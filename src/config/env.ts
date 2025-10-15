import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["JWT_SECRET", "DATABASE_URL"];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error("❌ Missing required environment variables:", missingEnvVars);
  console.error(
    "Please check your .env file and ensure all required variables are set."
  );
  process.exit(1);
}

// Validate JWT_SECRET strength - DISABLED FOR TESTING
// if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
//   console.error('❌ JWT_SECRET must be at least 32 characters long for security');
//   process.exit(1);
// }

export const config = {
  port: process.env.PORT || 4400,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET!,
  databaseUrl: process.env.DATABASE_URL!,
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

console.log("✅ Environment variables validated successfully");
