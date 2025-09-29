import { Router } from "express";
import { JobController } from "../controllers/job/job.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyRole } from "../middlewares/verifyRole";
import { UserRole } from "../generated/prisma";
import { GetJobController } from "../controllers/job/job.get.controller";

class JobRouter {
  private route: Router;

  constructor() {
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Public jobs listing (published jobs)
    this.route.get(
      "/public/jobs",
      require("../middlewares/validator/job.validator").validateListJobs,
      JobController.listPublic
    );
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

    // Applicants list with server-side pagination/filter/sort
    this.route.get(
      "/companies/:companyId/jobs/:jobId/applicants",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      require("../middlewares/validator/job.validator").validateApplicantsList,
      JobController.applicantsList
    );

    // Update applicant status (IN_REVIEW / INTERVIEW / ACCEPTED / REJECTED)
    this.route.put(
      "/companies/:companyId/jobs/:jobId/applications/:applicationId/status",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      require("../middlewares/validator/job.validator").validateUpdateApplicantStatus,
      JobController.updateApplicantStatus
    );

    this.route.get(
      "/all",
      GetJobController.getAllJobs
    );
    this.route.get("/:jobId", GetJobController.getJobById);

  }

  public getRouter(): Router {
    return this.route;
  }
}

export default JobRouter;
