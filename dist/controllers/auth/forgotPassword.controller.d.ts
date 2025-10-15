import { Request, Response, NextFunction } from "express";
export declare class ForgotPasswordController {
    static requestReset(req: Request, res: Response, next: NextFunction): Promise<void>;
    static resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=forgotPassword.controller.d.ts.map