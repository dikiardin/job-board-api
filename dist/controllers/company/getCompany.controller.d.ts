import { Request, Response, NextFunction } from "express";
export declare class GetCompanyController {
    static getAllCompanies(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCompanyBySlug(req: Request<{
        slug: string;
    }>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=getCompany.controller.d.ts.map