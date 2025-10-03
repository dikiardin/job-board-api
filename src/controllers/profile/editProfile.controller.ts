import { NextFunction, Request, Response } from "express";
import { EditProfileService } from "../../services/profile/editProfile.service";

export class EditProfileController {
  public static async editProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const decrypt = res.locals.decrypt;
      if (!decrypt) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = decrypt.userId;
      const role = decrypt.role;
      const files = req.files as Record<string, Express.Multer.File[]>;

      const uploadedFile =
        (files.profilePicture && files.profilePicture[0]) ||
        (files.logo && files.logo[0]);

      const updatedProfile = await EditProfileService.editProfile(
        userId,
        role,
        req.body,
        uploadedFile
      );

      res.status(200).json({
        message: "Profile completed successfully",
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async completeProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;

      const files = req.files as Record<string, Express.Multer.File[]>;
      const uploadedFile =
        (files?.profilePicture && files.profilePicture[0]) ||
        (files?.logo && files.logo[0]);

      const updatedProfile = await EditProfileService.completeProfile(
        userId,
        req.body,
        uploadedFile
      );

      res.status(200).json({
        message: "Profile completed successfully",
        data: updatedProfile,
      });
    } catch (err) {
      next(err);
    }
  }
}
