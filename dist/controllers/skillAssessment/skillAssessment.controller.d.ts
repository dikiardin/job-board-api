import { Request, Response, NextFunction } from "express";
export declare class SkillAssessmentController {
    static createAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessments(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentForUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    static submitAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserResults(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getDeveloperAssessments(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static downloadCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static verifyCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentResults(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserBadges(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=skillAssessment.controller.d.ts.map