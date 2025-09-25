"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const application_controller_1 = require("../controllers/application/application.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const uploadFile_1 = require("../middlewares/uploadFile");
const verifyRole_1 = require("../middlewares/verifyRole");
const prisma_1 = require("../generated/prisma");
class ApplicationRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/:jobId", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), (0, uploadFile_1.uploadSingleFile)("cvFile"), application_controller_1.ApplicationController.applyJob);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = ApplicationRouter;
//# sourceMappingURL=application.router.js.map