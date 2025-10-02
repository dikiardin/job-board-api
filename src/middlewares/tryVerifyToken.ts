import { NextFunction, Request, Response } from "express";
import { decodeToken } from "../utils/decodeToken";

export const tryVerifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;
    const token = auth?.split(" ")[1];
    if (!token) return next();
    const decoded = decodeToken(token) as any;
    res.locals.decrypt = decoded;
    next();
  } catch (err) {
    // Optional auth: ignore errors and continue as public request
    return next();
  }
};

