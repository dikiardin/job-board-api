import { NextFunction, Request, Response } from "express";
import { KeepLoginService } from "../../services/auth/keepLogin.service";

export class KeepLoginController {
  public static async keepLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = parseInt(res.locals.decrypt.userId);
      const result = await KeepLoginService.keepLogin(userId);

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
