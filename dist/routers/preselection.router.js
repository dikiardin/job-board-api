"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const preselection_controller_1 = require("../controllers/preselection/preselection.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const tryVerifyToken_1 = require("../middlewares/tryVerifyToken");
const verifyRole_1 = require("../middlewares/verifyRole");
const prisma_1 = require("../generated/prisma");
class PreselectionRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Create or replace a preselection test for a job (Company admin)
        this.route.post("/jobs/:jobId/tests", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), preselection_controller_1.PreselectionController.createTest);
        // Get test for a job (public/applicant; answers are hidden unless ADMIN)
        this.route.get("/jobs/:jobId/tests", tryVerifyToken_1.tryVerifyToken, preselection_controller_1.PreselectionController.getTest);
        // Applicant submits answers
        this.route.post("/applicants/:applicantId/tests/:testId/submit", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), preselection_controller_1.PreselectionController.submit);
        // Current applicant preselection status for a job
        this.route.get("/jobs/:jobId/my-status", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), preselection_controller_1.PreselectionController.myStatus);
        // Company admin views test results for applicants
        this.route.get("/jobs/:jobId/applicants/tests-results", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), preselection_controller_1.PreselectionController.getJobResults);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = PreselectionRouter;
