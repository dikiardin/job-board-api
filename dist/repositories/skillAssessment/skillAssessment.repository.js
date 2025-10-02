"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillAssessmentRepository = void 0;
const skillAssessmentCrud_repository_1 = require("./skillAssessmentCrud.repository");
const skillAssessmentResults_repository_1 = require("./skillAssessmentResults.repository");
class SkillAssessmentRepository {
    // Delegate to CRUD repository
    static async createAssessment(data) {
        return await skillAssessmentCrud_repository_1.SkillAssessmentCrudRepository.createAssessment(data);
    }
    static async getAllAssessments(page, limit) {
        return await skillAssessmentCrud_repository_1.SkillAssessmentCrudRepository.getAllAssessments(page, limit);
    }
    static async getAssessmentWithQuestions(assessmentId) {
        return await skillAssessmentCrud_repository_1.SkillAssessmentCrudRepository.getAssessmentWithQuestions(assessmentId);
    }
    static async getAssessmentWithAnswers(assessmentId) {
        return await skillAssessmentCrud_repository_1.SkillAssessmentCrudRepository.getAssessmentWithAnswers(assessmentId);
    }
    static async updateAssessment(assessmentId, createdBy, data) {
        return await skillAssessmentCrud_repository_1.SkillAssessmentCrudRepository.updateAssessment(assessmentId, createdBy, data);
    }
    static async deleteAssessment(assessmentId, createdBy) {
        return await skillAssessmentCrud_repository_1.SkillAssessmentCrudRepository.deleteAssessment(assessmentId, createdBy);
    }
    static async getDeveloperAssessments(createdBy) {
        return await skillAssessmentCrud_repository_1.SkillAssessmentCrudRepository.getDeveloperAssessments(createdBy);
    }
    // Delegate to Results repository
    static async saveAssessmentResult(data) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.saveAssessmentResult(data);
    }
    static async getUserResult(userId, assessmentId) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.getUserResult(userId, assessmentId);
    }
    static async getUserResults(userId, page, limit) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.getUserResults(userId, page, limit);
    }
    static async getAssessmentResults(assessmentId, createdBy) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.getAssessmentResults(assessmentId, createdBy || 0);
    }
    static async verifyCertificate(certificateCode) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.verifyCertificate(certificateCode);
    }
    static async getUserCertificates(userId, page, limit) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.getUserCertificates(userId, page, limit);
    }
    static async getAssessmentLeaderboard(assessmentId, limit) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.getAssessmentLeaderboard(assessmentId, limit);
    }
    static async getAssessmentStats(assessmentId) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.getAssessmentStats(assessmentId);
    }
    static async updateCertificateInfo(resultId, certificateUrl, certificateCode) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.updateCertificateInfo(resultId, certificateUrl, certificateCode);
    }
    static async getCertificateByCode(certificateCode) {
        return await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.getCertificateByCode(certificateCode);
    }
}
exports.SkillAssessmentRepository = SkillAssessmentRepository;
//# sourceMappingURL=skillAssessment.repository.js.map