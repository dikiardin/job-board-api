
import { ChangeEmailService } from "../../services/auth/changeEmail.service";
import { NextFunction, Request, Response } from "express";

export class ChangeEmailController {
  static async changeEmail(req: Request, res: Response, next:NextFunction) {
    try {
      const userId = res.locals.decrypt.userId;
      const { newEmail } = req.body;

      if (!newEmail) return res.status(400).json({ message: "New email is required" });

      const result = await ChangeEmailService.changeEmail(userId, newEmail);
      res.status(200).json(result);
    } catch (err) {
      next(err)
    }
  }
}