import { NextFunction, Request, Response } from "express";
export declare class SubscriptionController {
    static getAllSubscriptions(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getSubscriptionById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserSubscriptions(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserActiveSubscription(req: Request, res: Response, next: NextFunction): Promise<void>;
    static subscribe(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateSubscription(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=subscription.controller.d.ts.map