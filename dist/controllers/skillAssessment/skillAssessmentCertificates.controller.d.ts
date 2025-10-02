import { Request, Response, NextFunction } from "express";
export declare class SkillAssessmentCertificatesController {
    static downloadCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static verifyCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserCertificates(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserBadges(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBadgeDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
    static verifyBadge(req: Request, res: Response, next: NextFunction): Promise<void>;
    static shareCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=skillAssessmentCertificates.controller.d.ts.map