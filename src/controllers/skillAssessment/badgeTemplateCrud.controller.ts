import { Request, Response, NextFunction } from "express";
import { BadgeTemplateRepository } from "../../repositories/skillAssessment/badgeTemplate.repository";
import { CustomError } from "../../utils/customError";
import { UserRole } from "../../generated/prisma";
import { cloudinaryUpload } from "../../config/cloudinary";

export class BadgeTemplateCrudController {
  // Create badge template (Developer only)
  public static async createBadgeTemplate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Debug logging
      console.log('=== CREATE BADGE TEMPLATE DEBUG ===');
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      console.log('Headers:', req.headers);
      
      const { userId, role } = res.locals.decrypt;
      
      // Handle potential key spacing issues in form-data
      const bodyKeys = Object.keys(req.body);
      const nameKey = bodyKeys.find(key => key.trim() === 'name') || 'name';
      const descKey = bodyKeys.find(key => key.trim() === 'description') || 'description';
      const catKey = bodyKeys.find(key => key.trim() === 'category') || 'category';
      
      const name = req.body[nameKey];
      const description = req.body[descKey];
      const category = req.body[catKey];
      const iconFile = req.file;

      if (role !== UserRole.DEVELOPER) {
        throw new CustomError("Only developers can create badge templates", 403);
      }

      if (!name) {
        throw new CustomError("Badge name is required", 400);
      }

      if (!iconFile) {
        throw new CustomError("Badge icon image is required", 400);
      }

      // Validate file type (images only)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(iconFile.mimetype)) {
        throw new CustomError("Only image files (JPEG, PNG, GIF, WebP) are allowed for badge icons", 400);
      }

      // Validate file size (max 1MB)
      const maxSize = 1 * 1024 * 1024; // 1MB in bytes
      if (iconFile.size > maxSize) {
        throw new CustomError("Badge icon file size must be less than 1MB", 400);
      }

      // Check if name already exists
      const existingTemplate = await BadgeTemplateRepository.findByName(name);
      if (existingTemplate) {
        throw new CustomError("Badge template with this name already exists", 400);
      }

      // Upload icon to Cloudinary
      const uploadResult = await cloudinaryUpload(iconFile);

      console.log('Cloudinary upload result:', uploadResult);

      // Create badge template
      const badgeTemplate = await BadgeTemplateRepository.createBadgeTemplate({
        name,
        description: description || '',
        category: category || 'General',
        icon: uploadResult.secure_url,
        createdBy: userId,
      });

      console.log('Created badge template:', badgeTemplate);

      res.status(201).json({
        success: true,
        message: "Badge template created successfully",
        data: badgeTemplate,
        debug: {
          uploadResult: {
            public_id: uploadResult.public_id,
            secure_url: uploadResult.secure_url,
            format: uploadResult.format,
            bytes: uploadResult.bytes
          }
        }
      });
    } catch (error) {
      console.error('Badge template creation error:', error);
      next(error);
    }
  }

  // Get all badge templates
  public static async getAllBadgeTemplates(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await BadgeTemplateRepository.getAllBadgeTemplates(page, limit);

      res.status(200).json({
        success: true,
        message: "Badge templates retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get badge template by ID
  public static async getBadgeTemplateById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const templateId = parseInt(req.params.id || '0');

      if (isNaN(templateId) || templateId <= 0) {
        throw new CustomError("Invalid template ID", 400);
      }

      const badgeTemplate = await BadgeTemplateRepository.getBadgeTemplateById(templateId);

      if (!badgeTemplate) {
        throw new CustomError("Badge template not found", 404);
      }

      res.status(200).json({
        success: true,
        message: "Badge template retrieved successfully",
        data: badgeTemplate,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete badge template (Developer only)
  public static async deleteBadgeTemplate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      const templateId = parseInt(req.params.id || '0');

      if (role !== UserRole.DEVELOPER) {
        throw new CustomError("Only developers can delete badge templates", 403);
      }

      if (isNaN(templateId) || templateId <= 0) {
        throw new CustomError("Invalid template ID", 400);
      }

      // Check if template exists and belongs to developer
      const existingTemplate = await BadgeTemplateRepository.getBadgeTemplateById(templateId);
      if (!existingTemplate) {
        throw new CustomError("Badge template not found", 404);
      }

      if (existingTemplate.createdBy !== userId) {
        throw new CustomError("You can only delete your own badge templates", 403);
      }

      // Check if template is being used
      const isInUse = await BadgeTemplateRepository.isBadgeTemplateInUse(templateId);
      if (isInUse) {
        throw new CustomError("Cannot delete badge template that is currently in use", 400);
      }

      await BadgeTemplateRepository.deleteBadgeTemplate(templateId, userId);

      res.status(200).json({
        success: true,
        message: "Badge template deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
