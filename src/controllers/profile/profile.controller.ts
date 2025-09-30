import { Request, Response, NextFunction } from "express";
import { ProfileService } from "../../services/profile/profile.service";

export class ProfileController {
  static async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const decrypt = res.locals.decrypt; 
      if (!decrypt) return res.status(401).json({ message: "Unauthorized" });

      const user = await ProfileService.getUserProfile(decrypt.userId);
      res.status(200).json({ message: "User profile fetched", data: user });
    } catch (error) {
      next(error);
    }
  }

  static async getCompanyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const decrypt = res.locals.decrypt;
      if (!decrypt) return res.status(401).json({ message: "Unauthorized" });

      const company = await ProfileService.getCompanyProfile(decrypt.userId);
      res.status(200).json({ message: "Company profile fetched", data: company });
    } catch (error) {
      next(error);
    }
  }
}