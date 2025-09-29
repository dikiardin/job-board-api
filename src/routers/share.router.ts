import { Router } from "express";
import { JobShareController } from "../controllers/share/jobShare.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyRole } from "../middlewares/verifyRole";
import { UserRole } from "../generated/prisma";

class JobShareRouter {
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
      JobShareController.shareJob
    );

    this.route.get(
      "/job/:jobId",
      JobShareController.getSharesByJob
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default JobShareRouter;