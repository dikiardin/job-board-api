import { Request, Response, NextFunction } from 'express';
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
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.middleware.d.ts.map