"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeTemplateQueryController = void 0;
const badgeTemplate_repository_1 = require("../../repositories/skillAssessment/badgeTemplate.repository");
const BadgeTemplateHelper_1 = require("./helpers/BadgeTemplateHelper");
const customError_1 = require("../../utils/customError");
class BadgeTemplateQueryController {
    // Get all badge templates
    static async getAllBadgeTemplates(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
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
            const templateId = BadgeTemplateHelper_1.BadgeTemplateHelper.validateTemplateId(req.params.id || '0');
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
    // Get badge templates by developer
    static async getBadgeTemplatesByDeveloper(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            BadgeTemplateHelper_1.BadgeTemplateHelper.validateDeveloperRole(role);
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const templates = await badgeTemplate_repository_1.BadgeTemplateRepository.getAllBadgeTemplates(page, limit);
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
}
exports.BadgeTemplateQueryController = BadgeTemplateQueryController;
