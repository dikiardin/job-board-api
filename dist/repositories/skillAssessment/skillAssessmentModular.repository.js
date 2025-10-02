"use strict";
// Modular repository that delegates to specialized repositories
// This keeps the main repository under 200 lines while maintaining all functionality
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentResultsRepository = exports.AssessmentCrudRepository = exports.SkillAssessmentModularRepository = void 0;
const assessmentCrud_repository_1 = require("./assessmentCrud.repository");
Object.defineProperty(exports, "AssessmentCrudRepository", { enumerable: true, get: function () { return assessmentCrud_repository_1.AssessmentCrudRepository; } });
const assessmentResults_repository_1 = require("./assessmentResults.repository");
Object.defineProperty(exports, "AssessmentResultsRepository", { enumerable: true, get: function () { return assessmentResults_repository_1.AssessmentResultsRepository; } });
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
    // ===== ASSESSMENT RESULTS OPERATIONS =====
    // Delegate to AssessmentResultsRepository
    static async saveAssessmentResult(data) {
        return await assessmentResults_repository_1.AssessmentResultsRepository.saveAssessmentResult(data);
    }
    static async getUserResult(userId, assessmentId) {
        return await assessmentResults_repository_1.AssessmentResultsRepository.getUserResult(userId, assessmentId);
    }
    static async getAssessmentResults(assessmentId) {
        return await assessmentResults_repository_1.AssessmentResultsRepository.getAssessmentResults(assessmentId);
    }
    static async getUserResults(userId, page, limit) {
        return await assessmentResults_repository_1.AssessmentResultsRepository.getUserResults(userId, page, limit);
    }
    static async verifyCertificate(certificateCode) {
        return await assessmentResults_repository_1.AssessmentResultsRepository.verifyCertificate(certificateCode);
    }
    static async getUserCertificates(userId, page, limit) {
        return await assessmentResults_repository_1.AssessmentResultsRepository.getUserCertificates(userId, page, limit);
    }
    static async getCertificateByCode(certificateCode) {
        return await assessmentResults_repository_1.AssessmentResultsRepository.getCertificateByCode(certificateCode);
    }
    static async getAssessmentLeaderboard(assessmentId, limit) {
        return await assessmentResults_repository_1.AssessmentResultsRepository.getAssessmentLeaderboard(assessmentId, limit);
    }
    static async getAssessmentStatistics(assessmentId) {
        return await assessmentResults_repository_1.AssessmentResultsRepository.getAssessmentStatistics(assessmentId);
    }
    static async deleteAssessmentResult(resultId) {
        return await assessmentResults_repository_1.AssessmentResultsRepository.deleteAssessmentResult(resultId);
    }
    static async updateCertificateInfo(resultId, certificateUrl, certificateCode) {
        return await assessmentResults_repository_1.AssessmentResultsRepository.updateCertificateInfo(resultId, certificateUrl, certificateCode);
    }
    static async getUserAssessmentHistory(userId) {
        return await assessmentResults_repository_1.AssessmentResultsRepository.getUserAssessmentHistory(userId);
    }
    static async getGlobalAssessmentStats() {
        return await assessmentResults_repository_1.AssessmentResultsRepository.getGlobalAssessmentStats();
    }
    // ===== CONVENIENCE METHODS =====
    // Combined methods that use both repositories
    static async getAssessmentWithResults(assessmentId) {
        const [assessment, results, stats] = await Promise.all([
            this.getAssessmentById(assessmentId),
            this.getAssessmentResults(assessmentId),
            this.getAssessmentStatistics(assessmentId),
        ]);
        return {
            assessment,
            results,
            statistics: stats,
        };
    }
    static async getUserAssessmentSummary(userId) {
        const [results, certificates, history] = await Promise.all([
            this.getUserResults(userId),
            this.getUserCertificates(userId),
            this.getUserAssessmentHistory(userId),
        ]);
        return {
            results: results.results,
            certificates: certificates.certificates,
            statistics: history.statistics,
        };
    }
    // Export specialized repositories for direct access if needed
    static get CrudRepository() {
        return assessmentCrud_repository_1.AssessmentCrudRepository;
    }
    static get ResultsRepository() {
        return assessmentResults_repository_1.AssessmentResultsRepository;
    }
}
exports.SkillAssessmentModularRepository = SkillAssessmentModularRepository;
// For backward compatibility, also export as default
exports.default = SkillAssessmentModularRepository;
//# sourceMappingURL=skillAssessmentModular.repository.js.map