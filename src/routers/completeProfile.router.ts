import { Router } from "express";
import { CompleteProfileController } from "../controllers/complete-profile/completeProfile.controller";
import { verifyToken } from "../middlewares/verifyToken";
import multer from "multer";
import { uploadFields, uploadSingle } from "../middlewares/uploadImage";

class CompleteProfileRouter {
  private route: Router;
  private completeProfileController: typeof CompleteProfileController;

  constructor() {
    this.route = Router();
    this.completeProfileController = CompleteProfileController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post(
      "/",
      verifyToken,
      uploadFields([
        { name: "profilePicture", maxCount: 1 },
        { name: "logo", maxCount: 1 },
      ]),
      this.completeProfileController.completeProfile
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default CompleteProfileRouter;
