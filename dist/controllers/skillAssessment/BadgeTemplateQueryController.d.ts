import { Request, Response, NextFunction } from "express";
export declare class BadgeTemplateQueryController {
    static getAllBadgeTemplates(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBadgeTemplateById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBadgeTemplatesByDeveloper(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBadgeTemplateStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    static searchBadgeTemplates(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=BadgeTemplateQueryController.d.ts.map