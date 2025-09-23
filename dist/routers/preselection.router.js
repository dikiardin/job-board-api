"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const preselection_controller_1 = require("../controllers/preselection/preselection.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
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
        this.route.get("/jobs/:jobId/tests", preselection_controller_1.PreselectionController.getTest);
        // Applicant submits answers
        this.route.post("/applicants/:applicantId/tests/:testId/submit", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), preselection_controller_1.PreselectionController.submit);
        // Company admin views test results for applicants
        this.route.get("/jobs/:jobId/applicants/tests-results", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), preselection_controller_1.PreselectionController.getJobResults);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = PreselectionRouter;
//# sourceMappingURL=preselection.router.js.map