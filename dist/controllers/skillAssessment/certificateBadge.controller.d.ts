import { Request, Response, NextFunction } from "express";
export declare class CertificateBadgeController {
    static verifyCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static downloadCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserCertificates(req: Request, res: Response, next: NextFunction): Promise<void>;
    static shareCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCertificateAnalytics(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserBadges(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBadgeDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
    static verifyBadge(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBadgeAnalytics(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBadgeLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserBadgeProgress(req: Request, res: Response, next: NextFunction): Promise<void>;
    static shareBadge(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=certificateBadge.controller.d.ts.map