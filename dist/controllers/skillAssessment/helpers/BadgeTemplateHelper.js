"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeTemplateHelper = void 0;
const customError_1 = require("../../../utils/customError");
const prisma_1 = require("../../../generated/prisma");
class BadgeTemplateHelper {
    static validateDeveloperRole(role) {
        if (role !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can manage badge templates", 403);
        }
    }
    static validateTemplateId(templateId) {
        const id = parseInt(templateId || '0');
        if (isNaN(id) || id <= 0) {
            throw new customError_1.CustomError("Invalid template ID", 400);
        }
        return id;
    }
    static extractFormData(req) {
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
    static validateRequiredFields(name, iconFile) {
        if (!name) {
            throw new customError_1.CustomError("Badge name is required", 400);
        }
        if (!iconFile) {
            throw new customError_1.CustomError("Badge icon image is required", 400);
        }
    }
    static validateImageFile(iconFile) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(iconFile.mimetype)) {
            throw new customError_1.CustomError("Only image files (JPEG, PNG, GIF, WebP) are allowed for badge icons", 400);
        }
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (iconFile.size > maxSize) {
            throw new customError_1.CustomError("Image file size must be less than 5MB", 400);
        }
    }
    static buildUpdateData(name, description, category, iconUrl) {
        const updateData = {};
        if (name)
            updateData.name = name;
        if (description)
            updateData.description = description;
        if (category)
            updateData.category = category;
        if (iconUrl)
            updateData.icon = iconUrl;
        return updateData;
    }
}
exports.BadgeTemplateHelper = BadgeTemplateHelper;
