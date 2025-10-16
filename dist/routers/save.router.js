"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const saveJob_controller_1 = require("../controllers/save/saveJob.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const verifyRole_1 = require("../middlewares/verifyRole");
const prisma_1 = require("../generated/prisma");
class SavedJobRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/:jobId", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), saveJob_controller_1.SavedJobController.saveJob);
        this.route.get("/user/:userId", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), saveJob_controller_1.SavedJobController.getSavedJobsByUser);
        this.route.delete("/unsave/:jobId", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), saveJob_controller_1.SavedJobController.unsaveJob);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = SavedJobRouter;
