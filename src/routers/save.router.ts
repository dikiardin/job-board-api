import { Router } from "express";
import { SavedJobController } from "../controllers/save/saveJob.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyRole } from "../middlewares/verifyRole";
import { UserRole } from "../generated/prisma";

class SavedJobRouter {
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
      SavedJobController.saveJob
    );

    this.route.get(
      "/user/:userId",
      verifyToken,
      verifyRole([UserRole.USER]),
      SavedJobController.getSavedJobsByUser
    );

    this.route.delete(
      "/unsave/:jobId",
      verifyToken,
      verifyRole([UserRole.USER]),
      SavedJobController.unsaveJob
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default SavedJobRouter;
