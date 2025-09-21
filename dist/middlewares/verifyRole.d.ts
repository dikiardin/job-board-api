import { NextFunction, Request, Response } from "express";
import { UserRole } from "../generated/prisma";
export declare const verifyRole: (allowedRoles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=verifyRole.d.ts.map