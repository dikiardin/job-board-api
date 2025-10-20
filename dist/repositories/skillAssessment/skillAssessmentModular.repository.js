"use strict";
// Modular repository that delegates to specialized repositories
// This keeps the main repository under 200 lines while maintaining all functionality
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillAssessmentResultsRepository = exports.AssessmentCrudRepository = exports.SkillAssessmentModularRepository = void 0;
const assessmentCrud_repository_1 = require("./assessmentCrud.repository");
Object.defineProperty(exports, "AssessmentCrudRepository", { enumerable: true, get: function () { return assessmentCrud_repository_1.AssessmentCrudRepository; } });
const skillAssessmentResults_repository_1 = require("./skillAssessmentResults.repository");
Object.defineProperty(exports, "SkillAssessmentResultsRepository", { enumerable: true, get: function () { return skillAssessmentResults_repository_1.SkillAssessmentResultsRepository; } });
class SkillAssessmentModularRepository {
    // ===== ASSESSMENT CRUD OPERATIONS =====
    // Delegate to AssessmentCrudRepository
    static async createAssessment(data) {
        return await assessmentCrud_repository_1.AssessmentCrudRepository.createAssessment(data);
    }
    static async getAllAssessments(page = 1, limit = 10) {
        return await assessmentCrud_repository_1.AssessmentCrudRepository.getAllAssessments(page, limit);
    }
    static async getAssessmentById(assessmentId) {
        return await assessmentCrud_repository_1.AssessmentCrudRepository.getAssessmentById(assessmentId);
    }
    static async getAssessmentBySlug(slug) {
        return await assessmentCrud_repository_1.AssessmentCrudRepository.getAssessmentBySlug(slug);
    }
    static async updateAssessment(assessmentId, createdBy, data) {
        return await assessmentCrud_repository_1.AssessmentCrudRepository.updateAssessment(assessmentId, createdBy, data);
    }
    static async deleteAssessment(assessmentId, createdBy) {
        return await assessmentCrud_repository_1.AssessmentCrudRepository.deleteAssessment(assessmentId, createdBy);
    }
    static async getDeveloperAssessments(createdBy, page, limit) {
        return await assessmentCrud_repository_1.AssessmentCrudRepository.getDeveloperAssessments(createdBy, page, limit);
    }
    static async searchAssessments(searchTerm, page, limit) {
        return await assessmentCrud_repository_1.AssessmentCrudRepository.searchAssessments(searchTerm, page, limit);
    }
    static async isAssessmentTitleAvailable(title, excludeId) {
        return await assessmentCrud_repository_1.AssessmentCrudRepository.isAssessmentTitleAvailable(title, excludeId);
    }
    static async getAssessmentStats() {
        return await assessmentCrud_repository_1.AssessmentCrudRepository.getAssessmentStats();
    }
    static async getAssessmentByIdForDeveloper(assessmentId, createdBy) {
        return await assessmentCrud_repository_1.AssessmentCrudRepository.getAssessmentByIdForDeveloper(assessmentId, createdBy);
    }
    static async saveQuestion(data) {
        return await assessmentCrud_repository_1.AssessmentCrudRepository.saveQuestion(data);
    }
    // ===== ASSESSMENT RESULTS OPERATIONS =====
    // Delegate to SkillAssessmentResultsRepository
    static async saveAssessmentResult(data) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.saveAssessmentResult(data);
    }
    static async getUserResult(userId, assessmentId) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.getUserResult(userId, assessmentId);
    }
    static async getAssessmentResults(assessmentId, createdBy) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.getAssessmentResults(assessmentId, createdBy);
    }
    static async getUserResults(userId, page, limit) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.getUserResults(userId, page, limit);
    }
    static async verifyCertificate(certificateCode) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.verifyCertificate(certificateCode);
    }
    static async getUserCertificates(userId, page, limit) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.getUserCertificates(userId, page, limit);
    }
    static async getCertificateByCode(certificateCode) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.getCertificateByCode(certificateCode);
    }
    static async getAssessmentLeaderboard(assessmentId, limit) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.getAssessmentLeaderboard(assessmentId, limit);
    }
    static async getAssessmentStatistics(assessmentId) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.getAssessmentStats(assessmentId);
    }
    static async updateCertificateInfo(resultId, certificateUrl, certificateCode) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.updateCertificateInfo(resultId, certificateUrl, certificateCode);
    }
    // ===== CONVENIENCE METHODS =====
    /**
     * Get user assessment attempts for a specific assessment
     */
    static async getUserAssessmentAttempts(userId, assessmentId) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.getUserAssessmentAttempts(userId, assessmentId);
    }
}
exports.SkillAssessmentModularRepository = SkillAssessmentModularRepository;
// For backward compatibility, also export as default
exports.default = SkillAssessmentModularRepository;
