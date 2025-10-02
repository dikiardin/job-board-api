import { Request, Response, NextFunction } from "express";
export declare class AssessmentCreationController {
    static createAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentsForManagement(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentForEditing(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getDeveloperAssessments(req: Request, res: Response, next: NextFunction): Promise<void>;
    static searchAssessments(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentStatistics(req: Request, res: Response, next: NextFunction): Promise<void>;
    static duplicateAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=assessmentCreation.controller.d.ts.map