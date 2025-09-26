import { Request, Response, NextFunction } from "express";
import { ForgotPasswordService } from "../../services/auth/forgotPassword.service";

export class ForgotPasswordController {
  static async requestReset(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await ForgotPasswordService.requestReset(email);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const { newPassword, confirmPassword } = req.body;

      if (!token) {
        return res.status(400).json({ message: "Reset token is required" });
      }

      const result = await ForgotPasswordService.resetPassword(
        token,
        newPassword,
        confirmPassword
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
