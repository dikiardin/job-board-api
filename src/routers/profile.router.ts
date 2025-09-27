import { Router } from "express";
import { EditProfileController } from "../controllers/profile/editProfile.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { uploadFields } from "../middlewares/uploadImage";

class ProfileRouter {
  private route: Router;
  private editProfileController: typeof EditProfileController;

  constructor() {
    this.route = Router();
    this.editProfileController = EditProfileController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.put(
      "/edit",
      verifyToken,
      uploadFields([
        { name: "profilePicture", maxCount: 1 },
        { name: "logo", maxCount: 1 },
      ]),
      this.editProfileController.editProfile
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default ProfileRouter;
