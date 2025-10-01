import { Request, Response, NextFunction } from "express";
export declare class SavedJobController {
    static saveJob(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getSavedJobsByUser(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static unsaveJob(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=saveJob.controller.d.ts.map