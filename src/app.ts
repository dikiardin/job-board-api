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
    // Security headers
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false
    }));

    // Request logging (development only)
    if (process.env.NODE_ENV !== 'production') {
      this.app.use((req, res, next) => {
        console.log(`[${req.method}] ${req.url} - Origin: ${req.headers.origin}` );
        next();
      });
    }

    // CORS configuration
    this.app.use(
      cors({
        origin: process.env.NODE_ENV === 'production' 
          ? ['https://yourdomain.com'] 
          : ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
      } as CorsOptions)
    );

    // Body parsing with limits
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  private route(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("<h1>Job Board API</h1>");
    });

    this.app.get("/test-db", async (req: Request, res: Response) => {
      try {
        const company = await prisma.company.findFirst();
        res.status(200).json({ success: true, company });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    this.app.get("/test-jobs/:companyId", async (req: Request, res: Response) => {
      try {
        const companyId = parseInt(req.params.companyId || "0");
        const jobs = await prisma.job.findMany({ where: { companyId } });
        const company = await prisma.company.findUnique({ where: { id: companyId } });
        res.status(200).json({ success: true, company, jobs });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    this.app.post("/test-create-job", async (req: Request, res: Response) => {
      try {
        const job = await prisma.job.create({
          data: {
            companyId: 16,
            title: "Senior Frontend Developer",
            description: "We are looking for a senior frontend developer with React experience",
            category: "Engineering",
            city: "Jakarta",
            salaryMin: 15000000,
            salaryMax: 25000000,
            tags: ["React", "TypeScript", "Node.js"],
            isPublished: true,
          }
        });
        res.status(200).json({ success: true, job });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    this.app.get("/test-job-service", async (req: Request, res: Response) => {
      try {
        const { JobService } = await import("./services/job/job.service");
        const data = await JobService.listJobs({
          companyId: 16,
          requesterId: 77,
          requesterRole: "ADMIN" as any,
          query: { limit: 5, offset: 0 }
        });
        res.status(200).json({ success: true, data });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message, stack: error.stack });
      }
    });

    this.app.get("/test-job-controller", async (req: Request, res: Response) => {
      try {
        const { JobController } = await import("./controllers/job/job.controller");
        const mockReq = {
          params: { companyId: "16" },
          query: { limit: "5", offset: "0" }
        } as any;
        const mockRes = {
          status: (code: number) => ({
            json: (data: any) => res.status(code).json(data)
          }),
          locals: { decrypt: { userId: 77, role: "ADMIN" } }
        } as any;
        const mockNext = (error: any) => {
          if (error) {
            res.status(500).json({ success: false, error: error.message, stack: error.stack });
          }
        };
        
        await JobController.list(mockReq, mockRes, mockNext);
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message, stack: error.stack });
      }
    });

    this.app.get("/test-simple-jobs", async (req: Request, res: Response) => {
      try {
        const jobs = await prisma.job.findMany({ 
          where: { companyId: 16 },
          include: {
            _count: { select: { applications: true } }
          }
        });
        res.status(200).json({ success: true, jobs });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message, stack: error.stack });
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
    const skillAssessmentRouter: SkillAssessmentRouter = new SkillAssessmentRouter();
    const shareRouter: JobShareRouter = new JobShareRouter();
    const saveRouter: SavedJobRouter = new SavedJobRouter();

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
  
  }

  private errorHandling(): void {
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        console.error("Global error handler:", error);

        // Don't leak error details in production
        const isDevelopment = process.env.NODE_ENV === 'development';

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
            errors: error.details?.map((d: any) => d.message) || [error.message]
          });
        }

        if (error.code === 'P2002') {
          return res.status(409).json({
            success: false,
            message: "Duplicate entry. This record already exists."
          });
        }

        if (error.status) {
          return res.status(error.status).json({
            success: false,
            message: error.message,
            ...(isDevelopment && { stack: error.stack })
          });
        }

        res.status(500).json({
          success: false,
          message: isDevelopment ? error.message : "Internal server error",
          ...(isDevelopment && { stack: error.stack })
        });
      }
    );
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`API Running: http://localhost:${PORT}` );
      startSubscriptionJobs();
      startInterviewJobs();
    });
  }
}

export default App;
