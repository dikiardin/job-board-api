"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeTemplateController = void 0;
const badgeTemplate_repository_1 = require("../../repositories/skillAssessment/badgeTemplate.repository");
const customError_1 = require("../../utils/customError");
const prisma_1 = require("../../generated/prisma");
const cloudinary_1 = require("../../config/cloudinary");
class BadgeTemplateController {
    // Create badge template (Developer only)
    static async createBadgeTemplate(req, res, next) {
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
            if (role !== prisma_1.UserRole.DEVELOPER) {
                throw new customError_1.CustomError("Only developers can create badge templates", 403);
            }
            if (!name) {
                throw new customError_1.CustomError("Badge name is required", 400);
            }
            if (!iconFile) {
                throw new customError_1.CustomError("Badge icon image is required", 400);
            }
            // Validate file type (images only)
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(iconFile.mimetype)) {
                throw new customError_1.CustomError("Only image files (JPEG, PNG, GIF, WebP) are allowed for badge icons", 400);
            }
            // Validate file size (max 1MB)
            if (iconFile.size > 1024 * 1024) {
                throw new customError_1.CustomError("Badge icon file size must not exceed 1MB", 400);
            }
            // Check if name already exists
            const nameExists = await badgeTemplate_repository_1.BadgeTemplateRepository.checkBadgeTemplateNameExists(name);
            if (nameExists) {
                throw new customError_1.CustomError("Badge template name already exists", 400);
            }
            // Upload icon to Cloudinary
            const uploadResult = await (0, cloudinary_1.cloudinaryUpload)(iconFile);
            const iconUrl = uploadResult.secure_url;
            const template = await badgeTemplate_repository_1.BadgeTemplateRepository.createBadgeTemplate({
                name,
                icon: iconUrl,
                description,
                category,
                createdBy: userId,
            });
            res.status(201).json({
                success: true,
                message: "Badge template created successfully",
                data: template,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get all badge templates (public) - simplified without query params
    static async getAllBadgeTemplates(req, res, next) {
        try {
            // Default pagination - show first 20 templates
            const page = 1;
            const limit = 20;
            const templates = await badgeTemplate_repository_1.BadgeTemplateRepository.getAllBadgeTemplates(page, limit);
            res.status(200).json({
                success: true,
                message: "Badge templates retrieved successfully",
                data: templates,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get badge template by ID
    static async getBadgeTemplateById(req, res, next) {
        try {
            const templateId = parseInt(req.params.templateId || '0');
            if (isNaN(templateId) || templateId <= 0) {
                throw new customError_1.CustomError("Invalid template ID", 400);
            }
            const template = await badgeTemplate_repository_1.BadgeTemplateRepository.getBadgeTemplateById(templateId);
            if (!template) {
                throw new customError_1.CustomError("Badge template not found", 404);
            }
            res.status(200).json({
                success: true,
                message: "Badge template retrieved successfully",
                data: template,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get developer's badge templates
    static async getDeveloperBadgeTemplates(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            if (role !== prisma_1.UserRole.DEVELOPER) {
                throw new customError_1.CustomError("Only developers can view their badge templates", 403);
            }
            const templates = await badgeTemplate_repository_1.BadgeTemplateRepository.getDeveloperBadgeTemplates(userId);
            res.status(200).json({
                success: true,
                message: "Developer badge templates retrieved successfully",
                data: templates,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Update badge template (Developer only)
    static async updateBadgeTemplate(req, res, next) {
        try {
            console.log('=== UPDATE BADGE TEMPLATE DEBUG ===');
            console.log('Request params:', req.params);
            console.log('Request body:', req.body);
            console.log('Request file:', req.file);
            const { userId, role } = res.locals.decrypt;
            const templateId = parseInt(req.params.templateId || '0');
            // Handle potential key spacing issues in form-data
            const bodyKeys = Object.keys(req.body);
            console.log('Available body keys:', bodyKeys);
            const nameKey = bodyKeys.find(key => key.trim() === 'name') || 'name';
            const descKey = bodyKeys.find(key => key.trim() === 'description') || 'description';
            const catKey = bodyKeys.find(key => key.trim() === 'category') || 'category';
            const name = req.body[nameKey];
            const description = req.body[descKey];
            const category = req.body[catKey];
            const iconFile = req.file;
            console.log('Extracted values:', { templateId, name, description, category, hasFile: !!iconFile });
            if (role !== prisma_1.UserRole.DEVELOPER) {
                throw new customError_1.CustomError("Only developers can update badge templates", 403);
            }
            if (isNaN(templateId) || templateId <= 0) {
                throw new customError_1.CustomError("Invalid template ID", 400);
            }
            // Check if new name already exists (excluding current template)
            if (name) {
                const nameExists = await badgeTemplate_repository_1.BadgeTemplateRepository.checkBadgeTemplateNameExists(name, templateId);
                if (nameExists) {
                    throw new customError_1.CustomError("Badge template name already exists", 400);
                }
            }
            let iconUrl;
            // If new icon file is provided, upload it
            if (iconFile) {
                // Validate file type (images only)
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                if (!allowedTypes.includes(iconFile.mimetype)) {
                    throw new customError_1.CustomError("Only image files (JPEG, PNG, GIF, WebP) are allowed for badge icons", 400);
                }
                // Validate file size (max 1MB)
                if (iconFile.size > 1024 * 1024) {
                    throw new customError_1.CustomError("Badge icon file size must not exceed 1MB", 400);
                }
                // Upload new icon to Cloudinary
                const uploadResult = await (0, cloudinary_1.cloudinaryUpload)(iconFile);
                iconUrl = uploadResult.secure_url;
            }
            const updateData = {};
            if (name)
                updateData.name = name;
            if (description)
                updateData.description = description;
            if (category)
                updateData.category = category;
            if (iconUrl)
                updateData.icon = iconUrl;
            console.log('Update data to be sent:', updateData);
            const result = await badgeTemplate_repository_1.BadgeTemplateRepository.updateBadgeTemplate(templateId, userId, updateData);
            console.log('Update result:', result);
            if (result.count === 0) {
                throw new customError_1.CustomError("Badge template not found or no permission", 404);
            }
            res.status(200).json({
                success: true,
                message: "Badge template updated successfully",
                debug: { updateData, result }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Delete badge template (Developer only)
    static async deleteBadgeTemplate(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const templateId = parseInt(req.params.templateId || '0');
            if (role !== prisma_1.UserRole.DEVELOPER) {
                throw new customError_1.CustomError("Only developers can delete badge templates", 403);
            }
            if (isNaN(templateId) || templateId <= 0) {
                throw new customError_1.CustomError("Invalid template ID", 400);
            }
            const result = await badgeTemplate_repository_1.BadgeTemplateRepository.deleteBadgeTemplate(templateId, userId);
            if (result.count === 0) {
                if (result.error) {
                    throw new customError_1.CustomError(result.error, 400);
                }
                throw new customError_1.CustomError("Badge template not found or no permission", 404);
            }
            res.status(200).json({
                success: true,
                message: "Badge template deleted successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Search badge templates
    static async searchBadgeTemplates(req, res, next) {
        try {
            const query = req.query.q;
            if (!query || query.trim().length < 2) {
                throw new customError_1.CustomError("Search query must be at least 2 characters", 400);
            }
            const templates = await badgeTemplate_repository_1.BadgeTemplateRepository.searchBadgeTemplates(query.trim());
            res.status(200).json({
                success: true,
                message: "Badge templates search completed",
                data: templates,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get popular badge templates
    static async getPopularBadgeTemplates(req, res, next) {
        try {
            const limit = parseInt(req.query.limit || '10');
            const templates = await badgeTemplate_repository_1.BadgeTemplateRepository.getPopularBadgeTemplates(limit);
            res.status(200).json({
                success: true,
                message: "Popular badge templates retrieved successfully",
                data: templates,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get badge templates by category
    static async getBadgeTemplatesByCategory(req, res, next) {
        try {
            const category = req.params.category;
            if (!category) {
                throw new customError_1.CustomError("Category is required", 400);
            }
            const templates = await badgeTemplate_repository_1.BadgeTemplateRepository.getBadgeTemplatesByCategory(category);
            res.status(200).json({
                success: true,
                message: "Badge templates by category retrieved successfully",
                data: templates,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BadgeTemplateController = BadgeTemplateController;
//# sourceMappingURL=badgeTemplate.controller.js.map