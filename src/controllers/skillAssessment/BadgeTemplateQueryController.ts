import { Request, Response, NextFunction } from "express";
import { BadgeTemplateRepository } from "../../repositories/skillAssessment/badgeTemplate.repository";
import { BadgeTemplateHelper } from "./helpers/BadgeTemplateHelper";
import { CustomError } from "../../utils/customError";

export class BadgeTemplateQueryController {
  // Get all badge templates
  public static async getAllBadgeTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const templates = await BadgeTemplateRepository.getAllBadgeTemplates(page, limit);

      res.status(200).json({
        success: true,
        message: "Badge templates retrieved successfully",
        data: templates,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get badge template by ID
  public static async getBadgeTemplateById(req: Request, res: Response, next: NextFunction) {
    try {
      const templateId = BadgeTemplateHelper.validateTemplateId(req.params.id || '0');

      const template = await BadgeTemplateRepository.getBadgeTemplateById(templateId);
      if (!template) {
        throw new CustomError("Badge template not found", 404);
      }

      res.status(200).json({
        success: true,
        message: "Badge template retrieved successfully",
        data: template,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get badge templates by developer
  public static async getBadgeTemplatesByDeveloper(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = res.locals.decrypt;
      BadgeTemplateHelper.validateDeveloperRole(role);

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const templates = await BadgeTemplateRepository.getAllBadgeTemplates(page, limit);

      res.status(200).json({
        success: true,
        message: "Developer badge templates retrieved successfully",
        data: templates,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get badge template statistics (Developer only)
  public static async getBadgeTemplateStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = res.locals.decrypt;
      BadgeTemplateHelper.validateDeveloperRole(role);

      const stats = await BadgeTemplateRepository.getBadgeTemplateStats();

      res.status(200).json({
        success: true,
        message: "Badge template statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // Search badge templates
  public static async searchBadgeTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, category } = req.query;

      if (!query || typeof query !== 'string') {
        throw new CustomError("Search query is required", 400);
      }

      const templates = await BadgeTemplateRepository.searchBadgeTemplates(query);

      res.status(200).json({
        success: true,
        message: "Badge templates search completed",
        data: templates,
      });
    } catch (error) {
      next(error);
    }
  }
}
