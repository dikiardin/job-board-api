import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
export interface SubscriptionLimits {
    cvGenerationLimit: number;
    templatesAccess: string[];
    additionalFeatures: string[];
}
export declare const checkSubscription: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const checkCVGenerationLimit: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const checkTemplateAccess: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=subscription.middleware.d.ts.map