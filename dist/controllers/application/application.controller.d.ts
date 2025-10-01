import { Request, Response, NextFunction } from "express";
export declare class ApplicationController {
    static applyJob(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getApplicationsByUserId(req: Request<{
        userId: string;
    }>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=application.controller.d.ts.map