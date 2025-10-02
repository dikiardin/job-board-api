import { Request, Response, NextFunction } from "express";
export declare class SkillAssessmentOperationsController {
    static createAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessments(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentForTaking(req: Request, res: Response, next: NextFunction): Promise<void>;
    static submitAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserResults(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentResult(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentStats(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=skillAssessmentOperations.controller.d.ts.map