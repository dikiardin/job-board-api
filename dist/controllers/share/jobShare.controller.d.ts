import { Request, Response, NextFunction } from "express";
export declare class JobShareController {
    static shareJob(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getSharesByJob(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=jobShare.controller.d.ts.map