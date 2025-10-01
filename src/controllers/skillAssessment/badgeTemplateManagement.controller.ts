import { Request, Response, NextFunction } from "express";
import { BadgeTemplateRepository } from "../../repositories/skillAssessment/badgeTemplate.repository";
import { CustomError } from "../../utils/customError";
import { UserRole } from "../../generated/prisma";
import { cloudinaryUpload } from "../../config/cloudinary";

export class BadgeTemplateManagementController {
  // Update badge template (Developer only)
  public static async updateBadgeTemplate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      const templateId = parseInt(req.params.id || '0');
      
      // Handle potential key spacing issues in form-data
      const bodyKeys = Object.keys(req.body);
      const nameKey = bodyKeys.find(key => key.trim() === 'name') || 'name';
      const descKey = bodyKeys.find(key => key.trim() === 'description') || 'description';
      const catKey = bodyKeys.find(key => key.trim() === 'category') || 'category';
      
      const name = req.body[nameKey];
      const description = req.body[descKey];
      const category = req.body[catKey];
      const iconFile = req.file;
      
      console.log('Extracted values:', { templateId, name, description, category, hasFile: !!iconFile });

      if (role !== UserRole.DEVELOPER) {
        throw new CustomError("Only developers can update badge templates", 403);
      }

      if (isNaN(templateId) || templateId <= 0) {
        throw new CustomError("Invalid template ID", 400);
      }

      // Check if new name already exists (excluding current template)
      if (name) {
        const existingTemplate = await BadgeTemplateRepository.findByNameExcluding(name, templateId);
        if (existingTemplate) {
          throw new CustomError("Badge template with this name already exists", 400);
        }
      }

      // Get existing template
      const currentTemplate = await BadgeTemplateRepository.getBadgeTemplateById(templateId);
      if (!currentTemplate) {
        throw new CustomError("Badge template not found", 404);
      }

      if (currentTemplate.createdBy !== userId) {
        throw new CustomError("You can only update your own badge templates", 403);
      }

      let iconUrl = currentTemplate.icon;

      // Handle icon update if new file provided
      if (iconFile) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(iconFile.mimetype)) {
          throw new CustomError("Only image files (JPEG, PNG, GIF, WebP) are allowed for badge icons", 400);
        }

        // Validate file size (max 1MB)
        const maxSize = 1 * 1024 * 1024; // 1MB in bytes
        if (iconFile.size > maxSize) {
          throw new CustomError("Badge icon file size must be less than 1MB", 400);
        }

        // Upload new icon to Cloudinary
        const uploadResult = await cloudinaryUpload(iconFile);

        iconUrl = uploadResult.secure_url;
      }

      // Prepare update data
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (category !== undefined) updateData.category = category;
      if (iconUrl !== currentTemplate.icon) updateData.iconUrl = iconUrl;

      console.log('Update data:', updateData);

      // Update badge template
      const result = await BadgeTemplateRepository.updateBadgeTemplate(templateId, userId, updateData);

      if (!result) {
        throw new CustomError("Badge template not found or no permission", 404);
      }

      res.status(200).json({
        success: true,
        message: "Badge template updated successfully",
        debug: { updateData, result }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get developer's badge templates
  public static async getDeveloperBadgeTemplates(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (role !== UserRole.DEVELOPER) {
        throw new CustomError("Only developers can access their badge templates", 403);
      }

      const result = await BadgeTemplateRepository.getDeveloperBadgeTemplates(userId);

      res.status(200).json({
        success: true,
        message: "Developer badge templates retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get badge templates by category
  public static async getBadgeTemplatesByCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { category } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!category) {
        throw new CustomError("Category is required", 400);
      }

      const result = await BadgeTemplateRepository.getBadgeTemplatesByCategory(category);

      res.status(200).json({
        success: true,
        message: "Badge templates by category retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Search badge templates
  public static async searchBadgeTemplates(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { q: searchTerm } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!searchTerm || typeof searchTerm !== 'string') {
        throw new CustomError("Search term is required", 400);
      }

      const result = await BadgeTemplateRepository.searchBadgeTemplates(searchTerm);

      res.status(200).json({
        success: true,
        message: "Badge template search completed",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get badge template statistics (Developer only)
  public static async getBadgeTemplateStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { role } = res.locals.decrypt;

      if (role !== UserRole.DEVELOPER) {
        throw new CustomError("Only developers can access badge template statistics", 403);
      }

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
}
