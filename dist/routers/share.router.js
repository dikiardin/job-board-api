"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobShare_controller_1 = require("../controllers/share/jobShare.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const verifyRole_1 = require("../middlewares/verifyRole");
const prisma_1 = require("../generated/prisma");
class JobShareRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/:jobId", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), jobShare_controller_1.JobShareController.shareJob);
        this.route.get("/job/:jobId", jobShare_controller_1.JobShareController.getSharesByJob);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = JobShareRouter;
