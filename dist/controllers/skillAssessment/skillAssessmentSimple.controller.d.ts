import { Request, Response, NextFunction } from "express";
export declare class SkillAssessmentSimpleController {
    static createAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessments(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentForTaking(req: Request, res: Response, next: NextFunction): Promise<void>;
    static submitAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static verifyCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static downloadCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserCertificates(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserBadges(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBadgeDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void>;
    static shareCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static canRetakeAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserResults(req: Request, res: Response, next: NextFunction): Promise<void>;
    static retakeAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=skillAssessmentSimple.controller.d.ts.map