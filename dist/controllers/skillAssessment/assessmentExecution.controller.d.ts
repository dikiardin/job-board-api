import { Request, Response, NextFunction } from "express";
export declare class AssessmentExecutionController {
    static getAssessmentsForDiscovery(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentForTaking(req: Request, res: Response, next: NextFunction): Promise<void>;
    static submitAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserAssessmentResults(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    static canRetakeAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getTimeRemaining(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=assessmentExecution.controller.d.ts.map