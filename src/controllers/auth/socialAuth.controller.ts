import { Request, Response, NextFunction } from "express";
import { SocialAuthService } from "../../services/auth/socialAuth.service";

export class SocialAuthController {
  public static async socialLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { provider, token, role } = req.body;

      if (!["USER", "ADMIN"].includes(role)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid role" });
      }

      const result = await SocialAuthService.socialLogin(provider, token, role);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
