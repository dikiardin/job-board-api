"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeTemplateController = void 0;
const BadgeTemplateQueryController_1 = require("./BadgeTemplateQueryController");
const BadgeTemplateMutationController_1 = require("./BadgeTemplateMutationController");
const badgeTemplate_repository_1 = require("../../repositories/skillAssessment/badgeTemplate.repository");
const BadgeTemplateHelper_1 = require("./helpers/BadgeTemplateHelper");
const customError_1 = require("../../utils/customError");
class BadgeTemplateController {
    // Create badge template (Developer only)
    static async createBadgeTemplate(req, res, next) {
        return await BadgeTemplateMutationController_1.BadgeTemplateMutationController.createBadgeTemplate(req, res, next);
    }
    // Get all badge templates
    static async getAllBadgeTemplates(req, res, next) {
        return await BadgeTemplateQueryController_1.BadgeTemplateQueryController.getAllBadgeTemplates(req, res, next);
    }
    // Get badge template by ID
    static async getBadgeTemplateById(req, res, next) {
        return await BadgeTemplateQueryController_1.BadgeTemplateQueryController.getBadgeTemplateById(req, res, next);
    }
    // Get badge templates by developer
    static async getBadgeTemplatesByDeveloper(req, res, next) {
        return await BadgeTemplateQueryController_1.BadgeTemplateQueryController.getBadgeTemplatesByDeveloper(req, res, next);
    }
    // Update badge template (Developer only)
    static async updateBadgeTemplate(req, res, next) {
        return await BadgeTemplateMutationController_1.BadgeTemplateMutationController.updateBadgeTemplate(req, res, next);
    }
    // Delete badge template (Developer only)
    static async deleteBadgeTemplate(req, res, next) {
        return await BadgeTemplateMutationController_1.BadgeTemplateMutationController.deleteBadgeTemplate(req, res, next);
    }
    // Get badge template statistics (Developer only)
    static async getBadgeTemplateStats(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            BadgeTemplateHelper_1.BadgeTemplateHelper.validateDeveloperRole(role);
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
    // Search badge templates
    static async searchBadgeTemplates(req, res, next) {
        try {
            const { query, category } = req.query;
            if (!query || typeof query !== 'string') {
                throw new customError_1.CustomError("Search query is required", 400);
            }
            const templates = await badgeTemplate_repository_1.BadgeTemplateRepository.searchBadgeTemplates(query);
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
    // Get popular badge templates (alias for getAllBadgeTemplates)
    static async getPopularBadgeTemplates(req, res, next) {
        return await BadgeTemplateController.getAllBadgeTemplates(req, res, next);
    }
    // Get badge templates by category (alias for getAllBadgeTemplates)
    static async getBadgeTemplatesByCategory(req, res, next) {
        return await BadgeTemplateController.getAllBadgeTemplates(req, res, next);
    }
    // Get developer badge templates (alias for getAllBadgeTemplates)
    static async getDeveloperBadgeTemplates(req, res, next) {
        return await BadgeTemplateController.getAllBadgeTemplates(req, res, next);
    }
}
exports.BadgeTemplateController = BadgeTemplateController;
//# sourceMappingURL=badgeTemplate.controller.js.map