import { Request, Response, NextFunction } from "express";
export declare class AssessmentManagementController {
    static createAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentsForManagement(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentForTaking(req: Request, res: Response, next: NextFunction): Promise<void>;
    static submitAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=skillAssessmentRefactored.controller.d.ts.map