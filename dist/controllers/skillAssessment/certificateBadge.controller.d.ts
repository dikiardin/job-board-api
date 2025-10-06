import { Request, Response, NextFunction } from "express";
export declare class CertificateBadgeController {
    static verifyCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static downloadCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserCertificates(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserBadges(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBadgeById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static verifyBadge(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBadgeProgress(req: Request, res: Response, next: NextFunction): Promise<void>;
    static shareBadge(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBadgeLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBadgeStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAllBadges(req: Request, res: Response, next: NextFunction): Promise<void>;
    static awardBadge(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=certificateBadge.controller.d.ts.map