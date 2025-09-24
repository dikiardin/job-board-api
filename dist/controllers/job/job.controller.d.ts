import { Request, Response, NextFunction } from "express";
export declare class JobController {
    static create(req: Request, res: Response, next: NextFunction): Promise<void>;
    static list(req: Request, res: Response, next: NextFunction): Promise<void>;
    static detail(req: Request, res: Response, next: NextFunction): Promise<void>;
    static update(req: Request, res: Response, next: NextFunction): Promise<void>;
    static togglePublish(req: Request, res: Response, next: NextFunction): Promise<void>;
    static remove(req: Request, res: Response, next: NextFunction): Promise<void>;
    static applicantsList(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateApplicantStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=job.controller.d.ts.map