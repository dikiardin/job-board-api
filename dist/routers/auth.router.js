"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const basicAuth_controller_1 = require("../controllers/auth/basicAuth.controller");
const socialAuth_controller_1 = require("../controllers/auth/socialAuth.controller");
const keepLogin_controller_1 = require("../controllers/auth/keepLogin.controller");
const auth_1 = require("../middlewares/validator/auth");
const validate_1 = require("../middlewares/validator/validate");
const verifyToken_1 = require("../middlewares/verifyToken");
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
        this.route.post("/social/user", this.socialAuthController.socialUser);
        this.route.post("/social/admin", this.socialAuthController.socialAdmin);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = AuthRouter;
//# sourceMappingURL=auth.router.js.map