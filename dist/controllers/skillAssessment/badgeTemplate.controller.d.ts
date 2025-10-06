import { Request, Response, NextFunction } from "express";
export declare class BadgeTemplateController {
    static createBadgeTemplate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAllBadgeTemplates(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBadgeTemplateById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getBadgeTemplatesByDeveloper(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateBadgeTemplate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteBadgeTemplate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBadgeTemplateStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    static searchBadgeTemplates(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPopularBadgeTemplates(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBadgeTemplatesByCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getDeveloperBadgeTemplates(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=badgeTemplate.controller.d.ts.map