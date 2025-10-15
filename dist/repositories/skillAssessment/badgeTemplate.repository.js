"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeTemplateRepository = void 0;
const badgeTemplateQuery_repository_1 = require("./badgeTemplateQuery.repository");
const badgeTemplateMutation_repository_1 = require("./badgeTemplateMutation.repository");
const badgeTemplateValidation_repository_1 = require("./badgeTemplateValidation.repository");
const badgeTemplateStats_repository_1 = require("./badgeTemplateStats.repository");
class BadgeTemplateRepository {
    // Create badge template (Developer only)
    static async createBadgeTemplate(data) {
        return badgeTemplateMutation_repository_1.BadgeTemplateMutationRepository.createBadgeTemplate(data);
    }
    // Get all badge templates
    static async getAllBadgeTemplates(page = 1, limit = 10) {
        return badgeTemplateQuery_repository_1.BadgeTemplateQueryRepository.getAllBadgeTemplates(page, limit);
    }
    // Get badge template by ID
    static async getBadgeTemplateById(id) {
        return badgeTemplateQuery_repository_1.BadgeTemplateQueryRepository.getBadgeTemplateById(id);
    }
    // Get developer's badge templates
    static async getDeveloperBadgeTemplates(createdBy) {
        return badgeTemplateQuery_repository_1.BadgeTemplateQueryRepository.getDeveloperBadgeTemplates(createdBy);
    }
    // Update badge template
    static async updateBadgeTemplate(id, createdBy, data) {
        return badgeTemplateMutation_repository_1.BadgeTemplateMutationRepository.updateBadgeTemplate(id, createdBy, data);
    }
    // Delete badge template
    static async deleteBadgeTemplate(id, createdBy) {
        return badgeTemplateMutation_repository_1.BadgeTemplateMutationRepository.deleteBadgeTemplate(id, createdBy);
    }
    // Search badge templates by category or name
    static async searchBadgeTemplates(query) {
        return badgeTemplateQuery_repository_1.BadgeTemplateQueryRepository.searchBadgeTemplates(query);
    }
    // Get badge template by name (for assessment creation)
    static async getBadgeTemplateByName(name) {
        return badgeTemplateQuery_repository_1.BadgeTemplateQueryRepository.getBadgeTemplateByName(name);
    }
    // Get popular badge templates (most used)
    static async getPopularBadgeTemplates(limit = 10) {
        return badgeTemplateQuery_repository_1.BadgeTemplateQueryRepository.getPopularBadgeTemplates(limit);
    }
    // Get badge templates by category
    static async getBadgeTemplatesByCategory(category) {
        return badgeTemplateQuery_repository_1.BadgeTemplateQueryRepository.getBadgeTemplatesByCategory(category);
    }
    // Check if badge template name exists
    static async checkBadgeTemplateNameExists(name, excludeId) {
        return badgeTemplateValidation_repository_1.BadgeTemplateValidationRepository.checkBadgeTemplateNameExists(name, excludeId);
    }
    // Find badge template by name
    static async findByName(name) {
        return badgeTemplateQuery_repository_1.BadgeTemplateQueryRepository.findByName(name);
    }
    // Find badge template by name excluding specific ID
    static async findByNameExcluding(name, excludeId) {
        return badgeTemplateQuery_repository_1.BadgeTemplateQueryRepository.findByNameExcluding(name, excludeId);
    }
    // Check if badge template is in use
    static async isBadgeTemplateInUse(id) {
        return badgeTemplateValidation_repository_1.BadgeTemplateValidationRepository.isBadgeTemplateInUse(id);
    }
    // Get badge template statistics
    static async getBadgeTemplateStats() {
        return badgeTemplateStats_repository_1.BadgeTemplateStatsRepository.getBadgeTemplateStats();
    }
}
exports.BadgeTemplateRepository = BadgeTemplateRepository;
//# sourceMappingURL=badgeTemplate.repository.js.map