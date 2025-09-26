import { Request, Response, NextFunction } from "express";
import { ChangePasswordService } from "../../services/auth/changePassword.service";

export class ChangePasswordController {
  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.decrypt.userId;
      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const result = await ChangePasswordService.changePassword(
        userId,
        oldPassword,
        newPassword,
        confirmPassword
      );

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}