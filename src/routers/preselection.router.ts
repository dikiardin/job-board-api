import { Router } from "express";
import { PreselectionController } from "../controllers/preselection/preselection.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyRole } from "../middlewares/verifyRole";
import { UserRole } from "../generated/prisma";

class PreselectionRouter {
  private route: Router;

  constructor() {
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Create or replace a preselection test for a job (Company admin)
    this.route.post(
      "/jobs/:jobId/tests",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      PreselectionController.createTest
    );

    // Get test for a job (public/applicant; answers are hidden unless ADMIN)
    this.route.get(
      "/jobs/:jobId/tests",
      PreselectionController.getTest
    );

    // Applicant submits answers
    this.route.post(
      "/applicants/:applicantId/tests/:testId/submit",
      verifyToken,
      verifyRole([UserRole.USER]),
      PreselectionController.submit
    );

    // Company admin views test results for applicants
    this.route.get(
      "/jobs/:jobId/applicants/tests-results",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      PreselectionController.getJobResults
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default PreselectionRouter;
