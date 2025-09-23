import { Router } from "express";
import { JobController } from "../controllers/job/job.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyRole } from "../middlewares/verifyRole";
import { UserRole } from "../generated/prisma";

class JobRouter {
  private route: Router;

  constructor() {
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // All job management endpoints require ADMIN role and JWT
    this.route.post(
      "/companies/:companyId/jobs",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      JobController.create
    );

    this.route.get(
      "/companies/:companyId/jobs",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      JobController.list
    );

    this.route.get(
      "/companies/:companyId/jobs/:jobId",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      JobController.detail
    );

    this.route.put(
      "/companies/:companyId/jobs/:jobId",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      JobController.update
    );

    this.route.patch(
      "/companies/:companyId/jobs/:jobId/publish",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      JobController.togglePublish
    );

    this.route.delete(
      "/companies/:companyId/jobs/:jobId",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      JobController.remove
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default JobRouter;
