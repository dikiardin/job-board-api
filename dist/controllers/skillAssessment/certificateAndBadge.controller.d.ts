import { Request, Response, NextFunction } from "express";
export declare class CertificateAndBadgeController {
    static getUserResults(req: Request, res: Response, next: NextFunction): Promise<void>;
    static verifyCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static downloadCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserCertificates(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserBadges(req: Request, res: Response, next: NextFunction): Promise<void>;
    static shareCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=certificateAndBadge.controller.d.ts.map