import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { UserRole } from "../generated/prisma";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  emailVerified: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
  subscription?: {
    plan: any;
    limits: any;
    expiresAt: Date | null;
  };
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerifiedAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid token. User not found." });
    }

    if (!user.emailVerifiedAt) {
      return res.status(401).json({ message: "Account not verified." });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name ?? "",
      role: user.role,
      emailVerified: Boolean(user.emailVerifiedAt),
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};
