"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const completeProfile_controller_1 = require("../controllers/complete-profile/completeProfile.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const uploadImage_1 = require("../middlewares/uploadImage");
class CompleteProfileRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.completeProfileController = completeProfile_controller_1.CompleteProfileController;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/", verifyToken_1.verifyToken, (0, uploadImage_1.uploadFields)([
            { name: "profilePicture", maxCount: 1 },
            { name: "logo", maxCount: 1 },
        ]), this.completeProfileController.completeProfile);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = CompleteProfileRouter;
//# sourceMappingURL=completeProfile.router.js.map