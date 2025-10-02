import { Request, Response, NextFunction } from "express";
export declare class BadgeTemplateManagementController {
    static updateBadgeTemplate(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getDeveloperBadgeTemplates(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBadgeTemplatesByCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    static searchBadgeTemplates(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBadgeTemplateStats(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=badgeTemplateManagement.controller.d.ts.map