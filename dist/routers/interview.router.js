"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const interview_controller_1 = require("../controllers/interview/interview.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const verifyRole_1 = require("../middlewares/verifyRole");
const prisma_1 = require("../generated/prisma");
class InterviewRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Get jobs with applicant counts for dropdown
        this.route.get("/companies/:companyId/jobs-with-applicants", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), interview_controller_1.InterviewController.getJobsWithApplicantCounts);
        // Get eligible applicants for a specific job
        this.route.get("/companies/:companyId/jobs/:jobId/eligible-applicants", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), interview_controller_1.InterviewController.getEligibleApplicants);
        // Create multiple schedules for a job's accepted applicants
        this.route.post("/companies/:companyId/jobs/:jobId/interviews", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), require("../middlewares/validator/interview.validator").validateCreateManyInterviews, interview_controller_1.InterviewController.createMany);
        // List interviews for a company with filters
        this.route.get("/companies/:companyId/interviews", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), interview_controller_1.InterviewController.list);
        // Detail, Update, Delete
        this.route.get("/companies/:companyId/interviews/:id", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), interview_controller_1.InterviewController.detail);
        this.route.put("/companies/:companyId/interviews/:id", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), require("../middlewares/validator/interview.validator").validateUpdateInterview, interview_controller_1.InterviewController.update);
        this.route.delete("/companies/:companyId/interviews/:id", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), interview_controller_1.InterviewController.remove);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = InterviewRouter;
