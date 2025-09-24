import { Request } from 'express';
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
}
export interface JWTPayload {
    userId: number;
    email: string;
    role: UserRole;
}
//# sourceMappingURL=auth.types.d.ts.map