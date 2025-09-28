"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_controller_1 = require("../controllers/job/job.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const verifyRole_1 = require("../middlewares/verifyRole");
const prisma_1 = require("../generated/prisma");
class JobRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Public jobs listing (published jobs)
        this.route.get("/public/jobs", require("../middlewares/validator/job.validator").validateListJobs, job_controller_1.JobController.listPublic);
        // All job management endpoints require ADMIN role and JWT
        this.route.post("/companies/:companyId/jobs", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), job_controller_1.JobController.create);
        this.route.get("/companies/:companyId/jobs", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), job_controller_1.JobController.list);
        this.route.get("/companies/:companyId/jobs/:jobId", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), job_controller_1.JobController.detail);
        this.route.put("/companies/:companyId/jobs/:jobId", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), job_controller_1.JobController.update);
        this.route.patch("/companies/:companyId/jobs/:jobId/publish", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), job_controller_1.JobController.togglePublish);
        this.route.delete("/companies/:companyId/jobs/:jobId", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), job_controller_1.JobController.remove);
        // Applicants list with server-side pagination/filter/sort
        this.route.get("/companies/:companyId/jobs/:jobId/applicants", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), require("../middlewares/validator/job.validator").validateApplicantsList, job_controller_1.JobController.applicantsList);
        // Update applicant status (IN_REVIEW / INTERVIEW / ACCEPTED / REJECTED)
        this.route.put("/companies/:companyId/jobs/:jobId/applications/:applicationId/status", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), require("../middlewares/validator/job.validator").validateUpdateApplicantStatus, job_controller_1.JobController.updateApplicantStatus);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = JobRouter;
//# sourceMappingURL=job.router.js.map