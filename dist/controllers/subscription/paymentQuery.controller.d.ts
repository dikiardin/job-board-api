import { NextFunction, Request, Response } from "express";
export declare class PaymentQueryController {
    static getPendingPayments(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPaymentById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPaymentBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPaymentsBySubscriptionId(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=paymentQuery.controller.d.ts.map