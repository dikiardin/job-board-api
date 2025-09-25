import dotenv from "dotenv";
dotenv.config();
import cors, { CorsOptions } from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import AuthRouter from "./routers/auth.router";
import SubscriptionRouter from "./routers/subscription.router";
import { startSubscriptionJobs } from "./jobs/subscriptionJobs";
import PreselectionRouter from "./routers/preselection.router";
import ApplicationRouter from "./routers/application.router";
import JobRouter from "./routers/job.router";
import cvRoutes from "./routers/cv.router";
import InterviewRouter from "./routers/interview.router";
import { startInterviewJobs } from "./jobs/interviewJobs";
import AnalyticsRouter from "./routers/analytics.router";
import CompleteProfileRouter from "./routers/completeProfile.router";

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
    this.app.use((req, res, next) => {
      console.log(`[${req.method}] ${req.url} - Origin: ${req.headers.origin}`);
      next();
    });

    this.app.use(
      cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
      } as CorsOptions)
    );

    this.app.use(express.json());
  }

  private route(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("<h1>Job Board API</h1>");
    });

    const authRouter: AuthRouter = new AuthRouter();
    const subscriptionRouter: SubscriptionRouter = new SubscriptionRouter();
    const preselectionRouter: PreselectionRouter = new PreselectionRouter();
    const applicationRouter: ApplicationRouter = new ApplicationRouter();
    const jobRouter: JobRouter = new JobRouter();
    const interviewRouter: InterviewRouter = new InterviewRouter();
    const analyticsRouter: AnalyticsRouter = new AnalyticsRouter();
    const completeProfileRouter: CompleteProfileRouter = new CompleteProfileRouter();

    this.app.use("/auth", authRouter.getRouter());
    this.app.use("/subscription", subscriptionRouter.getRouter());
    this.app.use("/preselection", preselectionRouter.getRouter());
    this.app.use("/application", applicationRouter.getRouter());
    this.app.use("/job", jobRouter.getRouter());
    this.app.use("/cv", cvRoutes);
    this.app.use("/interview", interviewRouter.getRouter());
    this.app.use("/analytics", analyticsRouter.getRouter());
    this.app.use("/complete-profile", completeProfileRouter.getRouter());
  
  }

  private errorHandling(): void {
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
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
            message: error.message,
          });
        }

        res.status(500).json({
          message: "Internal server error",
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
