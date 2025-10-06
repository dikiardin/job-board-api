import { NextFunction, Request, Response } from "express";
export declare class GetJobController {
    static getAllJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getJobBySlug(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=job.get.controller.d.ts.map