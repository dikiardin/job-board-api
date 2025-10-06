"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeTemplateController = void 0;
const BadgeTemplateQueryController_1 = require("./BadgeTemplateQueryController");
const BadgeTemplateMutationController_1 = require("./BadgeTemplateMutationController");
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
        return await BadgeTemplateQueryController_1.BadgeTemplateQueryController.getBadgeTemplateStats(req, res, next);
    }
    // Search badge templates
    static async searchBadgeTemplates(req, res, next) {
        return await BadgeTemplateQueryController_1.BadgeTemplateQueryController.searchBadgeTemplates(req, res, next);
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