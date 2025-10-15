"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentCrudRepository = void 0;
const assessmentCrudQuery_repository_1 = require("./assessmentCrudQuery.repository");
const assessmentCrudMutation_repository_1 = require("./assessmentCrudMutation.repository");
const assessmentCrudValidation_repository_1 = require("./assessmentCrudValidation.repository");
const assessmentCrudStats_repository_1 = require("./assessmentCrudStats.repository");
class AssessmentCrudRepository {
    // Create new assessment
    static async createAssessment(data) {
        return assessmentCrudMutation_repository_1.AssessmentCrudMutationRepository.createAssessment(data);
    }
    // Get all assessments with pagination
    static async getAllAssessments(page = 1, limit = 10) {
        return assessmentCrudQuery_repository_1.AssessmentCrudQueryRepository.getAllAssessments(page, limit);
    }
    // Get assessment by ID
    static async getAssessmentById(assessmentId) {
        return assessmentCrudQuery_repository_1.AssessmentCrudQueryRepository.getAssessmentById(assessmentId);
    }
    // Get assessment by slug
    static async getAssessmentBySlug(slug) {
        return assessmentCrudQuery_repository_1.AssessmentCrudQueryRepository.getAssessmentBySlug(slug);
    }
    // Update assessment
    static async updateAssessment(assessmentId, createdBy, data) {
        return assessmentCrudMutation_repository_1.AssessmentCrudMutationRepository.updateAssessment(assessmentId, createdBy, data);
    }
    // Delete assessment
    static async deleteAssessment(assessmentId, createdBy) {
        return assessmentCrudMutation_repository_1.AssessmentCrudMutationRepository.deleteAssessment(assessmentId, createdBy);
    }
    // Get developer's assessments
    static async getDeveloperAssessments(createdBy, page, limit) {
        return assessmentCrudQuery_repository_1.AssessmentCrudQueryRepository.getDeveloperAssessments(createdBy, page, limit);
    }
    // Search assessments
    static async searchAssessments(searchTerm, page, limit) {
        return assessmentCrudQuery_repository_1.AssessmentCrudQueryRepository.searchAssessments(searchTerm, page, limit);
    }
    // Check if assessment title is available
    static async isAssessmentTitleAvailable(title, excludeId) {
        return assessmentCrudValidation_repository_1.AssessmentCrudValidationRepository.isAssessmentTitleAvailable(title, excludeId);
    }
    // Get assessment statistics
    static async getAssessmentStats() {
        return assessmentCrudStats_repository_1.AssessmentCrudStatsRepository.getAssessmentStats();
    }
    // Get assessment by ID for developer (includes questions)
    static async getAssessmentByIdForDeveloper(assessmentId, createdBy) {
        return assessmentCrudQuery_repository_1.AssessmentCrudQueryRepository.getAssessmentByIdForDeveloper(assessmentId, createdBy);
    }
    // Save individual question
    static async saveQuestion(data) {
        return assessmentCrudMutation_repository_1.AssessmentCrudMutationRepository.saveQuestion(data);
    }
}
exports.AssessmentCrudRepository = AssessmentCrudRepository;
//# sourceMappingURL=assessmentCrud.repository.js.map