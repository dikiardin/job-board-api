import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../utils/decodeToken";
import { CustomError } from "../utils/customError";

interface JwtPayload {
  userId: number;
  email: string;
  role: "USER" | "ADMIN";
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader);

    const token = authHeader?.split(" ")[1];
    console.log("Extracted Token:", token);

    if (!token) {
      throw new CustomError("Unauthorized token", 401);
    }

    const decoded = decodeToken(token) as JwtPayload;
    console.log("Decoded Token:", decoded);

    res.locals.decrypt = decoded;
    next();
  } catch (error: any) {
    console.log("Verify Token Error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token format" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token has expired" });
    }

    next(error);
  }
};