import { Request } from "express";
import { CustomError } from "../../../utils/customError";
import { UserRole } from "../../../generated/prisma";

export class BadgeTemplateHelper {
  public static validateDeveloperRole(role: UserRole): void {
    if (role !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can manage badge templates", 403);
    }
  }

  public static validateTemplateId(templateId: string): number {
    const id = parseInt(templateId || '0');
    if (isNaN(id) || id <= 0) {
      throw new CustomError("Invalid template ID", 400);
    }
    return id;
  }

  public static extractFormData(req: Request) {
    const bodyKeys = Object.keys(req.body);
    const nameKey = bodyKeys.find(key => key.trim() === 'name') || 'name';
    const descKey = bodyKeys.find(key => key.trim() === 'description') || 'description';
    const catKey = bodyKeys.find(key => key.trim() === 'category') || 'category';
    
    return {
      name: req.body[nameKey],
      description: req.body[descKey],
      category: req.body[catKey],
      iconFile: req.file
    };
  }

  public static validateRequiredFields(name: string, iconFile: any): void {
    if (!name) {
      throw new CustomError("Badge name is required", 400);
    }

    if (!iconFile) {
      throw new CustomError("Badge icon image is required", 400);
    }
  }

  public static validateImageFile(iconFile: any): void {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(iconFile.mimetype)) {
      throw new CustomError("Only image files (JPEG, PNG, GIF, WebP) are allowed for badge icons", 400);
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (iconFile.size > maxSize) {
      throw new CustomError("Image file size must be less than 5MB", 400);
    }
  }

  public static buildUpdateData(name?: string, description?: string, category?: string, iconUrl?: string) {
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (iconUrl) updateData.icon = iconUrl;
    return updateData;
  }
}
