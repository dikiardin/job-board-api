import { NextFunction, Request, Response } from "express";
import { SocialAuthService } from "../../services/auth/socialAuth.service";

export class SocialAuthController {
  public static async socialUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { provider, token } = req.body;
      const result = await SocialAuthService.socialLogin(provider, token, "USER");
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async socialAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { provider, token, companyId } = req.body;
      const result = await SocialAuthService.socialLogin(provider, token, "ADMIN", companyId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}