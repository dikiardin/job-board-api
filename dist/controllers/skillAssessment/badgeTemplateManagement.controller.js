"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeTemplateManagementController = void 0;
const badgeTemplate_repository_1 = require("../../repositories/skillAssessment/badgeTemplate.repository");
const BadgeTemplateHelper_1 = require("./helpers/BadgeTemplateHelper");
const customError_1 = require("../../utils/customError");
const prisma_1 = require("../../generated/prisma");
const cloudinary_1 = require("../../config/cloudinary");
class BadgeTemplateManagementController {
    // Update badge template (Developer only)
    static async updateBadgeTemplate(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            BadgeTemplateHelper_1.BadgeTemplateHelper.validateDeveloperRole(role);
            const templateId = BadgeTemplateHelper_1.BadgeTemplateHelper.validateTemplateId(req.params.id || '0');
            const { name, description, category, iconFile } = BadgeTemplateHelper_1.BadgeTemplateHelper.extractFormData(req);
            // Check if new name already exists (excluding current template)
            if (name) {
                const existingTemplate = await badgeTemplate_repository_1.BadgeTemplateRepository.findByNameExcluding(name, templateId);
                if (existingTemplate) {
                    throw new customError_1.CustomError("Badge template with this name already exists", 400);
                }
            }
            // Get existing template
            const currentTemplate = await badgeTemplate_repository_1.BadgeTemplateRepository.getBadgeTemplateById(templateId);
            if (!currentTemplate) {
                throw new customError_1.CustomError("Badge template not found", 404);
            }
            if (currentTemplate.createdBy !== userId) {
                throw new customError_1.CustomError("You can only update your own badge templates", 403);
            }
            let iconUrl = currentTemplate.icon;
            // Handle icon update if new file provided
            if (iconFile) {
                BadgeTemplateHelper_1.BadgeTemplateHelper.validateImageFile(iconFile);
                const uploadResult = await (0, cloudinary_1.cloudinaryUpload)(iconFile);
                iconUrl = uploadResult.secure_url;
            }
            const updateData = BadgeTemplateHelper_1.BadgeTemplateHelper.buildUpdateData(name, description, category, iconUrl || undefined);
            // Update badge template
            const result = await badgeTemplate_repository_1.BadgeTemplateRepository.updateBadgeTemplate(templateId, userId, updateData);
            if (!result) {
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
    // Get developer's badge templates
    static async getDeveloperBadgeTemplates(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            if (role !== prisma_1.UserRole.DEVELOPER) {
                throw new customError_1.CustomError("Only developers can access their badge templates", 403);
            }
            const result = await badgeTemplate_repository_1.BadgeTemplateRepository.getDeveloperBadgeTemplates(userId);
            res.status(200).json({
                success: true,
                message: "Developer badge templates retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get badge templates by category
    static async getBadgeTemplatesByCategory(req, res, next) {
        try {
            const { category } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            if (!category) {
                throw new customError_1.CustomError("Category is required", 400);
            }
            const result = await badgeTemplate_repository_1.BadgeTemplateRepository.getBadgeTemplatesByCategory(category);
            res.status(200).json({
                success: true,
                message: "Badge templates by category retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Search badge templates
    static async searchBadgeTemplates(req, res, next) {
        try {
            const { q: searchTerm } = req.query;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            if (!searchTerm || typeof searchTerm !== 'string') {
                throw new customError_1.CustomError("Search term is required", 400);
            }
            const result = await badgeTemplate_repository_1.BadgeTemplateRepository.searchBadgeTemplates(searchTerm);
            res.status(200).json({
                success: true,
                message: "Badge template search completed",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get badge template statistics (Developer only)
    static async getBadgeTemplateStats(req, res, next) {
        try {
            const { role } = res.locals.decrypt;
            if (role !== prisma_1.UserRole.DEVELOPER) {
                throw new customError_1.CustomError("Only developers can access badge template statistics", 403);
            }
            const stats = await badgeTemplate_repository_1.BadgeTemplateRepository.getBadgeTemplateStats();
            res.status(200).json({
                success: true,
                message: "Badge template statistics retrieved successfully",
                data: stats,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BadgeTemplateManagementController = BadgeTemplateManagementController;
//# sourceMappingURL=badgeTemplateManagement.controller.js.map