import { Router } from "express";
import { EditProfileController } from "../controllers/profile/editProfile.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { uploadFields } from "../middlewares/uploadImage";
import { ProfileController } from "../controllers/profile/profile.controller";

class ProfileRouter {
  private route: Router;
  private editProfileController: typeof EditProfileController;
  private profileController: typeof ProfileController;

  constructor() {
    this.route = Router();
    this.editProfileController = EditProfileController;
    this.profileController = ProfileController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.put(
      "/edit",
      verifyToken,
      uploadFields([
        { name: "profilePicture", maxCount: 1 },
        { name: "logoUrl", maxCount: 1 },
        { name: "bannerUrl", maxCount: 1 },
      ]),
      this.editProfileController.editProfile
    );
    this.route.put(
      "/complete",
      verifyToken, 
      uploadFields([
        { name: "profilePicture", maxCount: 1 },
        { name: "logoUrl", maxCount: 1 },
      ]),
      this.editProfileController.completeProfile
    );
    this.route.get("/user", verifyToken, this.profileController.getUserProfile);
    this.route.get(
      "/admin",
      verifyToken,
      this.profileController.getCompanyProfile
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default ProfileRouter;
