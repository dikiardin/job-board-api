import dotenv from "dotenv";
dotenv.config();
import cors, { CorsOptions } from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import AuthRouter from "./routers/auth.router";
import SubscriptionRouter from "./routers/subscription.router";
import { startSubscriptionJobs } from "./jobs/subscriptionJobs";
import PreselectionRouter from "./routers/preselection.router";
import ApplicationRouter from "./routers/application.router";
import JobRouter from "./routers/job.router";
import InterviewRouter from "./routers/interview.router";
import { startInterviewJobs } from "./jobs/interviewJobs";
import AnalyticsRouter from "./routers/analytics.router";
import ProfileRouter from "./routers/profile.router";
import CompanyRouter from "./routers/company.router";
import CompanyReviewRouter from "./routers/companyReview.router";
import SkillAssessmentRouter from "./routers/skillAssessment.router";
import { prisma } from "./config/prisma";
import JobShareRouter from "./routers/share.router";
import SavedJobRouter from "./routers/save.router";
import cvRoutes from "./routers/cv.router";
import ContactRouter from "./routers/contact.router";

const PORT: string = process.env.PORT || "5000";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.route();
    this.errorHandling();
  }

  private configure(): void {
    // Security headers - DISABLED FOR TESTING
    // this.app.use(
    //   helmet({
    //     contentSecurityPolicy: {
    //       directives: {
    //         defaultSrc: ["'self'"],
    //         styleSrc: ["'self'", "'unsafe-inline'"],
    //         scriptSrc: ["'self'"],
    //         imgSrc: ["'self'", "data:", "https:"],
    //       },
    //     },
    //     crossOriginEmbedderPolicy: false,
    //   })
    // );

    // Request logging (development only)
    if (process.env.NODE_ENV !== "production") {
      this.app.use((req, res, next) => {
        console.log(
          `[${req.method}] ${req.url} - Origin: ${req.headers.origin}`
        );
        next();
      });
    }

    // CORS configuration - SIMPLIFIED LIKE EVENT-MANAGEMENT-API
    this.app.use(
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

    // Body parsing with limits
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  }

  private route(): void {
    // Health check endpoint
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: "Job Board API is running",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      });
    });

    // Health check endpoint for monitoring
    this.app.get("/health", async (req: Request, res: Response) => {
      try {
        // Test database connection
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

    this.app.use("/auth", authRouter.getRouter());
    this.app.use("/subscription", subscriptionRouter.getRouter());
    this.app.use("/preselection", preselectionRouter.getRouter());
    this.app.use("/application", applicationRouter.getRouter());
    this.app.use("/job", jobRouter.getRouter());
    this.app.use("/cv", cvRoutes);
    this.app.use("/interview", interviewRouter.getRouter());
    this.app.use("/analytics", analyticsRouter.getRouter());
    this.app.use("/profile", profileRouter.getRouter());
    this.app.use("/company", companyRouter.getRouter());
    this.app.use("/reviews", companyReviewRouter.getRouter());
    this.app.use("/skill-assessment", skillAssessmentRouter.getRouter());
    this.app.use("/share", shareRouter.getRouter());
    this.app.use("/save", saveRouter.getRouter());
    this.app.use("/contact", contactRouter.getRouter());
  }

  private errorHandling(): void {
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        console.error("Global error handler:", error);

        // Don't leak error details in production
        const isDevelopment = process.env.NODE_ENV === "development";

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

        if (error.name === "ValidationError") {
          return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.details?.map((d: any) => d.message) || [
              error.message,
            ],
          });
        }

        if (error.code === "P2002") {
          return res.status(409).json({
            success: false,
            message: "Duplicate entry. This record already exists.",
          });
        }

        if (error.status) {
          return res.status(error.status).json({
            success: false,
            message: error.message,
            ...(isDevelopment && { stack: error.stack }),
          });
        }

        res.status(500).json({
          success: false,
          message: isDevelopment ? error.message : "Internal server error",
          ...(isDevelopment && { stack: error.stack }),
        });
      }
    );
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`API Running: http://localhost:${PORT}`);
      startSubscriptionJobs();
      startInterviewJobs();
    });
  }
}

export default App;
