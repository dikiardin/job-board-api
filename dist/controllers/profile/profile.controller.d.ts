import { Request, Response, NextFunction } from "express";
export declare class ProfileController {
    static getUserProfile(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getCompanyProfile(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=profile.controller.d.ts.map