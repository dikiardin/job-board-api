import { Router } from "express";
import { PreselectionController } from "../controllers/preselection/preselection.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { tryVerifyToken } from "../middlewares/tryVerifyToken";
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

    // Delete a preselection test for a job (Company admin)
    this.route.delete(
      "/jobs/:jobId/tests",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      PreselectionController.deleteTest
    );

    // Get test for a job (public/applicant; answers are hidden unless ADMIN)
    this.route.get(
      "/jobs/:jobId/tests",
      tryVerifyToken,
      PreselectionController.getTest
    );

    // Applicant submits answers
    this.route.post(
      "/applicants/:applicantId/tests/:testId/submit",
      verifyToken,
      verifyRole([UserRole.USER]),
      PreselectionController.submit
    );

    // Current applicant preselection status for a job
    this.route.get(
      "/jobs/:jobId/my-status",
      verifyToken,
      verifyRole([UserRole.USER]),
      PreselectionController.myStatus
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
