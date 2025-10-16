"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillAssessmentResultsRepository = void 0;
const skillAssessmentResultsQuery_repository_1 = require("./skillAssessmentResultsQuery.repository");
const skillAssessmentResultsMutation_repository_1 = require("./skillAssessmentResultsMutation.repository");
const skillAssessmentResultsCertificate_repository_1 = require("./skillAssessmentResultsCertificate.repository");
const skillAssessmentResultsStats_repository_1 = require("./skillAssessmentResultsStats.repository");
class SkillAssessmentResultsRepository {
    // Save assessment result
    static async saveAssessmentResult(data) {
        return skillAssessmentResultsMutation_repository_1.SkillAssessmentResultsMutationRepository.saveAssessmentResult(data);
    }
    // Get user's assessment result for specific assessment
    static async getUserResult(userId, assessmentId) {
        return skillAssessmentResultsQuery_repository_1.SkillAssessmentResultsQueryRepository.getUserResult(userId, assessmentId);
    }
    // Get user's all assessment results
    static async getUserResults(userId, page = 1, limit = 10) {
        return skillAssessmentResultsQuery_repository_1.SkillAssessmentResultsQueryRepository.getUserResults(userId, page, limit);
    }
    // Get result by slug
    static async getResultBySlug(slug) {
        return skillAssessmentResultsQuery_repository_1.SkillAssessmentResultsQueryRepository.getResultBySlug(slug);
    }
    // Get assessment results for developer
    static async getAssessmentResults(assessmentId, createdBy) {
        return skillAssessmentResultsQuery_repository_1.SkillAssessmentResultsQueryRepository.getAssessmentResults(assessmentId, createdBy);
    }
    // Verify certificate by code
    static async verifyCertificate(certificateCode) {
        return skillAssessmentResultsCertificate_repository_1.SkillAssessmentResultsCertificateRepository.verifyCertificate(certificateCode);
    }
    // Get user's certificates
    static async getUserCertificates(userId, page = 1, limit = 10) {
        return skillAssessmentResultsCertificate_repository_1.SkillAssessmentResultsCertificateRepository.getUserCertificates(userId, page, limit);
    }
    // Get assessment leaderboard
    static async getAssessmentLeaderboard(assessmentId, limit = 10) {
        return skillAssessmentResultsQuery_repository_1.SkillAssessmentResultsQueryRepository.getAssessmentLeaderboard(assessmentId, limit);
    }
    // Get assessment statistics
    static async getAssessmentStats(assessmentId) {
        return skillAssessmentResultsStats_repository_1.SkillAssessmentResultsStatsRepository.getAssessmentStats(assessmentId);
    }
    // Update certificate info
    static async updateCertificateInfo(resultId, certificateUrl, certificateCode) {
        return skillAssessmentResultsMutation_repository_1.SkillAssessmentResultsMutationRepository.updateCertificateInfo(resultId, certificateUrl, certificateCode);
    }
    // Get certificate by code
    static async getCertificateByCode(certificateCode) {
        return skillAssessmentResultsCertificate_repository_1.SkillAssessmentResultsCertificateRepository.getCertificateByCode(certificateCode);
    }
    // Get user assessment attempts for a specific assessment
    static async getUserAssessmentAttempts(userId, assessmentId) {
        return skillAssessmentResultsQuery_repository_1.SkillAssessmentResultsQueryRepository.getUserAssessmentAttempts(userId, assessmentId);
    }
}
exports.SkillAssessmentResultsRepository = SkillAssessmentResultsRepository;
