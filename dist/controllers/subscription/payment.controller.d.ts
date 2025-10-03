import { NextFunction, Request, Response } from "express";
export declare class PaymentController {
    static getPendingPayments(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPaymentById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static uploadPaymentProof(req: Request, res: Response, next: NextFunction): Promise<void>;
    static approvePayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static rejectPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPaymentsBySubscriptionId(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=payment.controller.d.ts.map