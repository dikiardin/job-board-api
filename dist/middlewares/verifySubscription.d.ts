import { Request, Response, NextFunction } from "express";
export declare const verifySubscription: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const checkAssessmentLimits: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=verifySubscription.d.ts.map