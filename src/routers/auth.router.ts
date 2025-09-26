import { Router } from "express";
import { BasicAuthController } from "../controllers/auth/basicAuth.controller";
import { SocialAuthController } from "../controllers/auth/socialAuth.controller";
import { KeepLoginController } from "../controllers/auth/keepLogin.controller";
import {
  userRegisterValidation,
  companyRegisterValidation,
} from "../middlewares/validator/auth";
import { validateRequest } from "../middlewares/validator/validate";
import { verifyToken } from "../middlewares/verifyToken";
import { ChangeEmailController } from "../controllers/auth/changeEmail.controller";
import { ChangePasswordController } from "../controllers/auth/changePassword.controller";
import { ForgotPasswordController } from "../controllers/auth/forgotPassword.controller";

class AuthRouter {
  private route: Router;
  private basicAuthController: typeof BasicAuthController;
  private socialAuthController: typeof SocialAuthController;
  private keepLoginController: typeof KeepLoginController;

  constructor() {
    this.route = Router();
    this.basicAuthController = BasicAuthController;
    this.socialAuthController = SocialAuthController;
    this.keepLoginController = KeepLoginController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post(
      "/signup/user",
      userRegisterValidation,
      validateRequest,
      this.basicAuthController.register
    );
    this.route.post(
      "/signup/admin",
      companyRegisterValidation,
      validateRequest,
      this.basicAuthController.register
    );
    this.route.post("/signin", validateRequest, this.basicAuthController.login);
    this.route.get("/verify/:token", this.basicAuthController.verifyEmail);
    this.route.get("/keep", verifyToken, this.keepLoginController.keepLogin);
    this.route.post("/social", this.socialAuthController.socialLogin);

    this.route.patch(
      "/change-email",
      verifyToken,
      ChangeEmailController.changeEmail
    );
    this.route.patch(
      "/change-password",
      verifyToken,
      ChangePasswordController.changePassword
    );
    this.route.post("/forgot-password", ForgotPasswordController.requestReset);
    this.route.post(
      "/reset-password/:token",
      ForgotPasswordController.resetPassword
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default AuthRouter;
