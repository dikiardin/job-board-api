import { Request, Response, NextFunction } from "express";
import { BadgeTemplateRepository } from "../../repositories/skillAssessment/badgeTemplate.repository";
import { BadgeTemplateHelper } from "./helpers/BadgeTemplateHelper";
import { CustomError } from "../../utils/customError";
import { cloudinaryUpload } from "../../config/cloudinary";

export class BadgeTemplateMutationController {
  // Create badge template (Developer only)
  public static async createBadgeTemplate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      BadgeTemplateHelper.validateDeveloperRole(role);

      const { name, description, category, iconFile } =
        BadgeTemplateHelper.extractFormData(req);
      BadgeTemplateHelper.validateRequiredFields(name, iconFile);

      if (iconFile) {
        BadgeTemplateHelper.validateImageFile(iconFile);
      }

      const existingTemplate = await BadgeTemplateRepository.findByName(name);
      if (existingTemplate) {
        throw new CustomError(
          "Badge template with this name already exists",
          400
        );
      }

      if (!iconFile) {
        throw new CustomError("Badge icon image is required", 400);
      }
      const uploadResult = await cloudinaryUpload(iconFile);

      const badgeTemplate = await BadgeTemplateRepository.createBadgeTemplate({
        name,
        description: description || "",
        category: category || "General",
        icon: uploadResult.secure_url,
        createdBy: userId,
      });

      res.status(201).json({
        success: true,
        message: "Badge template created successfully",
        data: badgeTemplate,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update badge template (Developer only)
  public static async updateBadgeTemplate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      BadgeTemplateHelper.validateDeveloperRole(role);

      const templateId = BadgeTemplateHelper.validateTemplateId(
        req.params.templateId || "0"
      );
      const { name, description, category, iconFile } =
        BadgeTemplateHelper.extractFormData(req);

      if (name) {
        const existingTemplate =
          await BadgeTemplateRepository.findByNameExcluding(name, templateId);
        if (existingTemplate) {
          throw new CustomError(
            "Badge template with this name already exists",
            400
          );
        }
      }

      const currentTemplate =
        await BadgeTemplateRepository.getBadgeTemplateById(templateId);
      if (!currentTemplate) {
        throw new CustomError("Badge template not found", 404);
      }

      let iconUrl = currentTemplate.icon;
      if (iconFile) {
        BadgeTemplateHelper.validateImageFile(iconFile);
        const uploadResult = await cloudinaryUpload(iconFile);
        iconUrl = uploadResult.secure_url;
      }

      const updateData = BadgeTemplateHelper.buildUpdateData(
        name,
        description,
        category,
        iconUrl || undefined
      );
      const result = await BadgeTemplateRepository.updateBadgeTemplate(
        templateId,
        userId,
        updateData
      );

      if (result.count === 0) {
        throw new CustomError("Badge template not found or no permission", 404);
      }

      res.status(200).json({
        success: true,
        message: "Badge template updated successfully",
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
      BadgeTemplateHelper.validateDeveloperRole(role);

      const templateId = BadgeTemplateHelper.validateTemplateId(
        req.params.templateId || "0"
      );
      const result = await BadgeTemplateRepository.deleteBadgeTemplate(
        templateId,
        userId
      );

      if (result.count === 0) {
        throw new CustomError("Badge template not found or no permission", 404);
      }

      res.status(200).json({
        success: true,
        message: "Badge template deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
