import { Router } from "express";
import { ApplicationController } from "../controllers/application/application.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { uploadSingleFile } from "../middlewares/uploadFile";
import { verifyRole } from "../middlewares/verifyRole";
import { UserRole } from "../generated/prisma";

class ApplicationRouter {
  private route: Router;

  constructor() {
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post(
      "/:jobId",
      verifyToken,
      verifyRole([UserRole.USER]),
      uploadSingleFile("cvFile"),
      ApplicationController.applyJob
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default ApplicationRouter;
