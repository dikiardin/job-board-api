import { Router } from "express";
import { ApplicationController } from "../controllers/application/application.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyRole } from "../middlewares/verifyRole";
import { UserRole } from "../generated/prisma";

class ApplicationRouter {
  private route: Router;

  constructor() {
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Create application for a job (Applicant only)
    this.route.post(
      "/jobs/:jobId/applications",
      verifyToken,
      verifyRole([UserRole.USER]),
      ApplicationController.create
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default ApplicationRouter;
