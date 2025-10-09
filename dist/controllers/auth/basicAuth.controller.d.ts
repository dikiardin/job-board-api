import { NextFunction, Request, Response } from "express";
export declare class BasicAuthController {
    static register(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static verifyEmail(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static resendVerification(req: Request, res: Response, next: NextFunction): Promise<void>;
    static login(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=basicAuth.controller.d.ts.map