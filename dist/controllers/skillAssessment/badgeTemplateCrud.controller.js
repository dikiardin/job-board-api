"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeTemplateCrudController = void 0;
const badgeTemplate_repository_1 = require("../../repositories/skillAssessment/badgeTemplate.repository");
const customError_1 = require("../../utils/customError");
const prisma_1 = require("../../generated/prisma");
const cloudinary_1 = require("../../config/cloudinary");
class BadgeTemplateCrudController {
    // Create badge template (Developer only)
    static async createBadgeTemplate(req, res, next) {
        try {
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
            const maxSize = 1 * 1024 * 1024; // 1MB in bytes
            if (iconFile.size > maxSize) {
                throw new customError_1.CustomError("Badge icon file size must be less than 1MB", 400);
            }
            // Check if name already exists
            const existingTemplate = await badgeTemplate_repository_1.BadgeTemplateRepository.findByName(name);
            if (existingTemplate) {
                throw new customError_1.CustomError("Badge template with this name already exists", 400);
            }
            // Upload icon to Cloudinary
            const uploadResult = await (0, cloudinary_1.cloudinaryUpload)(iconFile);
            // Create badge template
            const badgeTemplate = await badgeTemplate_repository_1.BadgeTemplateRepository.createBadgeTemplate({
                name,
                description: description || '',
                category: category || 'General',
                icon: uploadResult.secure_url,
                createdBy: userId,
            });
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
        }
        catch (error) {
            next(error);
        }
    }
    // Get all badge templates
    static async getAllBadgeTemplates(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await badgeTemplate_repository_1.BadgeTemplateRepository.getAllBadgeTemplates(page, limit);
            res.status(200).json({
                success: true,
                message: "Badge templates retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get badge template by ID
    static async getBadgeTemplateById(req, res, next) {
        try {
            const templateId = parseInt(req.params.id || '0');
            if (isNaN(templateId) || templateId <= 0) {
                throw new customError_1.CustomError("Invalid template ID", 400);
            }
            const badgeTemplate = await badgeTemplate_repository_1.BadgeTemplateRepository.getBadgeTemplateById(templateId);
            if (!badgeTemplate) {
                throw new customError_1.CustomError("Badge template not found", 404);
            }
            res.status(200).json({
                success: true,
                message: "Badge template retrieved successfully",
                data: badgeTemplate,
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
            const templateId = parseInt(req.params.id || '0');
            if (role !== prisma_1.UserRole.DEVELOPER) {
                throw new customError_1.CustomError("Only developers can delete badge templates", 403);
            }
            if (isNaN(templateId) || templateId <= 0) {
                throw new customError_1.CustomError("Invalid template ID", 400);
            }
            // Check if template exists and belongs to developer
            const existingTemplate = await badgeTemplate_repository_1.BadgeTemplateRepository.getBadgeTemplateById(templateId);
            if (!existingTemplate) {
                throw new customError_1.CustomError("Badge template not found", 404);
            }
            if (existingTemplate.createdBy !== userId) {
                throw new customError_1.CustomError("You can only delete your own badge templates", 403);
            }
            // Check if template is being used
            const isInUse = await badgeTemplate_repository_1.BadgeTemplateRepository.isBadgeTemplateInUse(templateId);
            if (isInUse) {
                throw new customError_1.CustomError("Cannot delete badge template that is currently in use", 400);
            }
            await badgeTemplate_repository_1.BadgeTemplateRepository.deleteBadgeTemplate(templateId, userId);
            res.status(200).json({
                success: true,
                message: "Badge template deleted successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BadgeTemplateCrudController = BadgeTemplateCrudController;
//# sourceMappingURL=badgeTemplateCrud.controller.js.map