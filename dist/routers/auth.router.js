"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const basicAuth_controller_1 = require("../controllers/auth/basicAuth.controller");
const socialAuth_controller_1 = require("../controllers/auth/socialAuth.controller");
const keepLogin_controller_1 = require("../controllers/auth/keepLogin.controller");
const auth_1 = require("../middlewares/validator/auth");
const validate_1 = require("../middlewares/validator/validate");
const verifyToken_1 = require("../middlewares/verifyToken");
const changeEmail_controller_1 = require("../controllers/auth/changeEmail.controller");
const changePassword_controller_1 = require("../controllers/auth/changePassword.controller");
const forgotPassword_controller_1 = require("../controllers/auth/forgotPassword.controller");
class AuthRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.basicAuthController = basicAuth_controller_1.BasicAuthController;
        this.socialAuthController = socialAuth_controller_1.SocialAuthController;
        this.keepLoginController = keepLogin_controller_1.KeepLoginController;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/signup/user", auth_1.userRegisterValidation, validate_1.validateRequest, this.basicAuthController.register);
        this.route.post("/signup/admin", auth_1.companyRegisterValidation, validate_1.validateRequest, this.basicAuthController.register);
        this.route.post("/signin", validate_1.validateRequest, this.basicAuthController.login);
        this.route.get("/verify/:token", this.basicAuthController.verifyEmail);
        this.route.get("/keep", verifyToken_1.verifyToken, this.keepLoginController.keepLogin);
        this.route.post("/social", this.socialAuthController.socialLogin);
        this.route.patch("/change-email", verifyToken_1.verifyToken, changeEmail_controller_1.ChangeEmailController.changeEmail);
        this.route.patch("/change-password", verifyToken_1.verifyToken, changePassword_controller_1.ChangePasswordController.changePassword);
        this.route.post("/forgot-password", forgotPassword_controller_1.ForgotPasswordController.requestReset);
        this.route.post("/reset-password/:token", forgotPassword_controller_1.ForgotPasswordController.resetPassword);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = AuthRouter;
//# sourceMappingURL=auth.router.js.map