import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";

const app: Application = express();

// Configure CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://job-board-app-xi.vercel.app",
      ...(process.env.FE_URL ? [process.env.FE_URL] : []),
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Job Board API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log("Global error handler:", error);

  if (error.name === "JsonWebTokenError") {
    return res
      .status(401)
      .json({ success: false, message: "Invalid token format" });
  }

  if (error.name === "TokenExpiredError") {
    return res
      .status(401)
      .json({ success: false, message: "Token has expired" });
  }

  if (error.status) {
    return res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;
