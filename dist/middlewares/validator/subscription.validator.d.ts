import { Request, Response, NextFunction } from "express";
export declare class SubscriptionValidator {
    static validateSubscribeRequest: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    static validateUpdateRequest: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    static validatePlanCreation: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    static validatePlanUpdate: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
}
//# sourceMappingURL=subscription.validator.d.ts.map