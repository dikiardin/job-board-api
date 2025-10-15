import { NextFunction, Request, Response } from "express";
export declare class PaymentActionController {
    static approvePayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static approvePaymentBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
    static rejectPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static rejectPaymentBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=paymentAction.controller.d.ts.map