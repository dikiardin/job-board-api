import { Request, Response, NextFunction } from "express";
export declare class InterviewController {
    static getJobsWithApplicantCounts(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getEligibleApplicants(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createMany(req: Request, res: Response, next: NextFunction): Promise<void>;
    static list(req: Request, res: Response, next: NextFunction): Promise<void>;
    static detail(req: Request, res: Response, next: NextFunction): Promise<void>;
    static update(req: Request, res: Response, next: NextFunction): Promise<void>;
    static remove(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=interview.controller.d.ts.map