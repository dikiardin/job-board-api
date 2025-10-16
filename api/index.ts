import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import AuthRouter from "../src/routers/auth.router";
import SubscriptionRouter from "../src/routers/subscription.router";
import PreselectionRouter from "../src/routers/preselection.router";
import ApplicationRouter from "../src/routers/application.router";
import JobRouter from "../src/routers/job.router";
import InterviewRouter from "../src/routers/interview.router";
import AnalyticsRouter from "../src/routers/analytics.router";
import ProfileRouter from "../src/routers/profile.router";
import CompanyRouter from "../src/routers/company.router";
import CompanyReviewRouter from "../src/routers/companyReview.router";
import SkillAssessmentRouter from "../src/routers/skillAssessment.router";
import { prisma } from "../src/config/prisma";
import JobShareRouter from "../src/routers/share.router";
import SavedJobRouter from "../src/routers/save.router";
import cvRoutes from "../src/routers/cv.router";
import ContactRouter from "../src/routers/contact.router";

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

app.get("/health", async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(503).json({
      success: false,
      status: "unhealthy",
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Router setup
const authRouter: AuthRouter = new AuthRouter();
const subscriptionRouter: SubscriptionRouter = new SubscriptionRouter();
const preselectionRouter: PreselectionRouter = new PreselectionRouter();
const applicationRouter: ApplicationRouter = new ApplicationRouter();
const jobRouter: JobRouter = new JobRouter();
const interviewRouter: InterviewRouter = new InterviewRouter();
const analyticsRouter: AnalyticsRouter = new AnalyticsRouter();
const profileRouter: ProfileRouter = new ProfileRouter();
const companyRouter: CompanyRouter = new CompanyRouter();
const companyReviewRouter: CompanyReviewRouter = new CompanyReviewRouter();
const skillAssessmentRouter: SkillAssessmentRouter =
  new SkillAssessmentRouter();
const shareRouter: JobShareRouter = new JobShareRouter();
const saveRouter: SavedJobRouter = new SavedJobRouter();
const contactRouter: ContactRouter = new ContactRouter();

app.use("/auth", authRouter.getRouter());
app.use("/subscription", subscriptionRouter.getRouter());
app.use("/preselection", preselectionRouter.getRouter());
app.use("/application", applicationRouter.getRouter());
app.use("/job", jobRouter.getRouter());
app.use("/cv", cvRoutes);
app.use("/interview", interviewRouter.getRouter());
app.use("/analytics", analyticsRouter.getRouter());
app.use("/profile", profileRouter.getRouter());
app.use("/company", companyRouter.getRouter());
app.use("/reviews", companyReviewRouter.getRouter());
app.use("/skill-assessment", skillAssessmentRouter.getRouter());
app.use("/share", shareRouter.getRouter());
app.use("/save", saveRouter.getRouter());
app.use("/contact", contactRouter.getRouter());

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
