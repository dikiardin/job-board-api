import { Response } from "express";
export declare class ControllerHelper {
    static parseId(id: string | undefined): number;
    static getUserId(res: Response): number;
    static validateRequired(data: Record<string, any>, message: string): void;
    static buildUpdateData(body: any, allowedFields: string[]): Record<string, any>;
}
//# sourceMappingURL=controllerHelper.d.ts.map