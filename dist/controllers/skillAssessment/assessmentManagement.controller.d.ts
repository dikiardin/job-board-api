import { Request, Response, NextFunction } from "express";
export declare class AssessmentManagementController {
    static createAssessment(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getAssessments(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAssessmentBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getDeveloperAssessments(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=assessmentManagement.controller.d.ts.map