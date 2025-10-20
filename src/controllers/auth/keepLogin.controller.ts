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
      
      if (!userId || isNaN(userId)) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid user ID in token" 
        });
      }
      
      const result = await KeepLoginService.keepLogin(userId);

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      console.error("Error in keepLogin controller:", error);
      
      // Handle specific error cases
      if (error?.statusCode === 404) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found. Please sign in again." 
        });
      } else if (error?.statusCode === 500) {
        return res.status(500).json({ 
          success: false, 
          message: error.message || "Authentication failed. Please try again later." 
        });
      }
      
      // For any other error, pass to error handler
      next(error);
    }
  }
}
