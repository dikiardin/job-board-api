import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { UserRole } from '../generated/prisma';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
  subscription?: {
    plan: any;
    limits: any;
    endDate: Date;
  };
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Get user from database to ensure they still exist and are verified
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Account not verified.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};
