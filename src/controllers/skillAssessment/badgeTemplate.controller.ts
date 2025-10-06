import { Request, Response, NextFunction } from "express";
import { BadgeTemplateQueryController } from "./BadgeTemplateQueryController";
import { BadgeTemplateMutationController } from "./BadgeTemplateMutationController";

export class BadgeTemplateController {
  // Create badge template (Developer only)
  public static async createBadgeTemplate(req: Request, res: Response, next: NextFunction) {
    return await BadgeTemplateMutationController.createBadgeTemplate(req, res, next);
  }

  // Get all badge templates
  public static async getAllBadgeTemplates(req: Request, res: Response, next: NextFunction) {
    return await BadgeTemplateQueryController.getAllBadgeTemplates(req, res, next);
  }

  // Get badge template by ID
  public static async getBadgeTemplateById(req: Request, res: Response, next: NextFunction) {
    return await BadgeTemplateQueryController.getBadgeTemplateById(req, res, next);
  }

  // Get badge templates by developer
  public static async getBadgeTemplatesByDeveloper(req: Request, res: Response, next: NextFunction) {
    return await BadgeTemplateQueryController.getBadgeTemplatesByDeveloper(req, res, next);
  }

  // Update badge template (Developer only)
  public static async updateBadgeTemplate(req: Request, res: Response, next: NextFunction) {
    return await BadgeTemplateMutationController.updateBadgeTemplate(req, res, next);
  }

  // Delete badge template (Developer only)
  public static async deleteBadgeTemplate(req: Request, res: Response, next: NextFunction) {
    return await BadgeTemplateMutationController.deleteBadgeTemplate(req, res, next);
  }

  // Get badge template statistics (Developer only)
  public static async getBadgeTemplateStats(req: Request, res: Response, next: NextFunction) {
    return await BadgeTemplateQueryController.getBadgeTemplateStats(req, res, next);
  }

  // Search badge templates
  public static async searchBadgeTemplates(req: Request, res: Response, next: NextFunction) {
    return await BadgeTemplateQueryController.searchBadgeTemplates(req, res, next);
  }

  // Get popular badge templates (alias for getAllBadgeTemplates)
  public static async getPopularBadgeTemplates(req: Request, res: Response, next: NextFunction) {
    return await BadgeTemplateController.getAllBadgeTemplates(req, res, next);
  }

  // Get badge templates by category (alias for getAllBadgeTemplates)
  public static async getBadgeTemplatesByCategory(req: Request, res: Response, next: NextFunction) {
    return await BadgeTemplateController.getAllBadgeTemplates(req, res, next);
  }

  // Get developer badge templates (alias for getAllBadgeTemplates)
  public static async getDeveloperBadgeTemplates(req: Request, res: Response, next: NextFunction) {
    return await BadgeTemplateController.getAllBadgeTemplates(req, res, next);
  }
}
