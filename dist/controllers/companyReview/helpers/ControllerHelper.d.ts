import { Request, Response } from "express";
export declare class ControllerHelper {
    static getUserId(res: Response): number;
    static getCompanyId(req: Request): string;
    static getPaginationParams(req: Request): {
        page: number;
        limit: number;
        sortBy: string;
        sortOrder: string;
    };
    static sendSuccessResponse(res: Response, message: string, data?: any, statusCode?: number): void;
    static sendDeleteResponse(res: Response, message: string): void;
}
//# sourceMappingURL=ControllerHelper.d.ts.map