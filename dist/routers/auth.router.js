"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middlewares/validator/auth");
const validate_1 = require("../middlewares/validator/validate");
const verifyToken_1 = require("../middlewares/verifyToken");
class AuthRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.authController = auth_controller_1.AuthController;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/signup/user", auth_1.userRegisterValidation, validate_1.validateRequest, this.authController.register);
        this.route.post("/signup/company", auth_1.companyRegisterValidation, validate_1.validateRequest, this.authController.register);
        this.route.post("/signin", validate_1.validateRequest, this.authController.login);
        this.route.post("/social", auth_controller_1.AuthController.socialLogin);
        this.route.get("/verify/:token", this.authController.verifyEmail);
        this.route.get("/keep", verifyToken_1.verifyToken, this.authController.keepLogin);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = AuthRouter;
//# sourceMappingURL=auth.router.js.map