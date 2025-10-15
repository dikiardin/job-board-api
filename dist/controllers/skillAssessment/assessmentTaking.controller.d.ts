import { Request, Response, NextFunction } from "express";
export declare class AssessmentTakingController {
    static getAssessmentForUserBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentForUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    static submitAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserResults(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentResults(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserAssessmentAttempts(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=assessmentTaking.controller.d.ts.map