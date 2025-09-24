import { Router } from "express";
import { InterviewController } from "../controllers/interview/interview.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyRole } from "../middlewares/verifyRole";
import { UserRole } from "../generated/prisma";

class InterviewRouter {
  private route: Router;

  constructor() {
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Create multiple schedules for a job's accepted applicants
    this.route.post(
      "/companies/:companyId/jobs/:jobId/interviews",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      InterviewController.createMany
    );

    // List interviews for a company with filters
    this.route.get(
      "/companies/:companyId/interviews",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      InterviewController.list
    );

    // Detail, Update, Delete
    this.route.get(
      "/companies/:companyId/interviews/:id",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      InterviewController.detail
    );

    this.route.put(
      "/companies/:companyId/interviews/:id",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      InterviewController.update
    );

    this.route.delete(
      "/companies/:companyId/interviews/:id",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      InterviewController.remove
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default InterviewRouter;
