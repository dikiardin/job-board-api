import { NextFunction, Request, Response } from "express";
import { UserRole } from "../generated/prisma";

export const verifyRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = res.locals.decrypt.role as UserRole;

      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized to access this resource",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
