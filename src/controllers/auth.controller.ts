import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  public static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { role, name, email, password, phone } = req.body;

      // validate role strictly
      if (role !== "USER" && role !== "ADMIN") {
        return res.status(400).json({ message: "Invalid role" });
      }

      const result = await AuthService.register(
        role,
        name,
        email,
        password,
        phone
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

      const result = await AuthService.verifyEmail(token);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
      }

      const result = await AuthService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async keepLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = parseInt(res.locals.decrypt.userId);
      const result = await AuthService.keepLogin(userId);

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
