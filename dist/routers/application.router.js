"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const application_controller_1 = require("../controllers/application/application.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const verifyRole_1 = require("../middlewares/verifyRole");
const prisma_1 = require("../generated/prisma");
class ApplicationRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Create application for a job (Applicant only)
        this.route.post("/jobs/:jobId/applications", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), application_controller_1.ApplicationController.create);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = ApplicationRouter;
//# sourceMappingURL=application.router.js.map