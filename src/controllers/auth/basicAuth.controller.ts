import { NextFunction, Request, Response } from "express";
import { BasicAuthService } from "../../services/auth/basicAuth.service";

export class BasicAuthController {
  public static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { role, name, email, password } = req.body;
      if (role !== "USER" && role !== "ADMIN") {
        return res.status(400).json({ message: "Invalid role" });
      }

      const result = await BasicAuthService.register(
        role,
        name,
        email,
        password
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { token } = req.params;
      if (!token) {
        return res.status(400).json({ error: "Token missing" });
      }

      const {
        message,
        token: jwt,
        user,
      } = await BasicAuthService.verifyEmail(token);

      res.status(200).json({
        message,
        token: jwt,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async resendVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;
      const result = await BasicAuthService.resendVerificationEmail(email);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
      }

      const result = await BasicAuthService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
