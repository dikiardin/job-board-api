import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import {
  userRegisterValidation,
  companyRegisterValidation,
} from "../middlewares/validator/auth";
import { validateRequest } from "../middlewares/validator/validate";
import { verifyToken } from "../middlewares/verifyToken";

class AuthRouter {
  private route: Router;
  private authController: typeof AuthController;

  constructor() {
    this.route = Router();
    this.authController = AuthController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post(
      "/signup/user",
      userRegisterValidation,
      validateRequest,
      this.authController.register
    );

    this.route.post(
      "/signup/company",
      companyRegisterValidation,
      validateRequest,
      this.authController.register
    );

    this.route.post(
      "/signin",
      validateRequest,
      this.authController.login
    );

    this.route.get("/verify/:token", this.authController.verifyEmail);

    this.route.get("/keep", verifyToken, this.authController.keepLogin);

  }

  public getRouter(): Router {
    return this.route;
  }
}

export default AuthRouter;