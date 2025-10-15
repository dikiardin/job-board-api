import { Request, Response, NextFunction } from "express";
export declare class CertificateManagementController {
    static downloadCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static viewCertificate(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static verifyCertificate(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getUserBadges(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=certificateManagement.controller.d.ts.map