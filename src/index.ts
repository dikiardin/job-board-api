import App from "./app";

const main = async () => {
  try {
    console.log("🚀 Starting Job Board API...");

    // Check critical environment variables
    const criticalEnvVars = ["DATABASE_URL"];
    const missingVars = criticalEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingVars.length > 0) {
      console.warn("⚠️ Missing critical environment variables:", missingVars);
      console.warn("⚠️ Application will continue with fallback values");
    }

    // Initialize server
    const server = new App();
    server.start();

    console.log("✅ Job Board API started successfully");
  } catch (error) {
    console.error("❌ Failed to start Job Board API:", error);
    process.exit(1);
  }
};

// Handle startup errors
main().catch((error) => {
  console.error("❌ Unhandled startup error:", error);
  process.exit(1);
});
