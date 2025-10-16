import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Job Board API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

export default app;
