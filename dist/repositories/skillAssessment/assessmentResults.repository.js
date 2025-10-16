"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentResultsRepository = void 0;
const assessmentResultsQuery_repository_1 = require("./assessmentResultsQuery.repository");
const assessmentResultsMutation_repository_1 = require("./assessmentResultsMutation.repository");
const assessmentResultsCertificate_repository_1 = require("./assessmentResultsCertificate.repository");
const assessmentResultsStats_repository_1 = require("./assessmentResultsStats.repository");
class AssessmentResultsRepository {
    // Save assessment result
    static async saveAssessmentResult(data) {
        return assessmentResultsMutation_repository_1.AssessmentResultsMutationRepository.saveAssessmentResult(data);
    }
    // Get user's result for specific assessment
    static async getUserResult(userId, assessmentId) {
        return assessmentResultsQuery_repository_1.AssessmentResultsQueryRepository.getUserResult(userId, assessmentId);
    }
    // Get all results for an assessment
    static async getAssessmentResults(assessmentId) {
        return assessmentResultsQuery_repository_1.AssessmentResultsQueryRepository.getAssessmentResults(assessmentId);
    }
    // Get user's all results with pagination
    static async getUserResults(userId, page, limit) {
        return assessmentResultsQuery_repository_1.AssessmentResultsQueryRepository.getUserResults(userId, page, limit);
    }
    // Verify certificate by code
    static async verifyCertificate(certificateCode) {
        return assessmentResultsCertificate_repository_1.AssessmentResultsCertificateRepository.verifyCertificate(certificateCode);
    }
    // Get user's certificates
    static async getUserCertificates(userId, page, limit) {
        return assessmentResultsCertificate_repository_1.AssessmentResultsCertificateRepository.getUserCertificates(userId, page, limit);
    }
    // Get certificate by code
    static async getCertificateByCode(certificateCode) {
        return assessmentResultsCertificate_repository_1.AssessmentResultsCertificateRepository.getCertificateByCode(certificateCode);
    }
    // Get assessment leaderboard
    static async getAssessmentLeaderboard(assessmentId, limit) {
        return assessmentResultsQuery_repository_1.AssessmentResultsQueryRepository.getAssessmentLeaderboard(assessmentId, limit);
    }
    // Get assessment statistics
    static async getAssessmentStatistics(assessmentId) {
        return assessmentResultsStats_repository_1.AssessmentResultsStatsRepository.getAssessmentStatistics(assessmentId);
    }
    // Delete assessment result
    static async deleteAssessmentResult(resultId) {
        return assessmentResultsMutation_repository_1.AssessmentResultsMutationRepository.deleteAssessmentResult(resultId);
    }
    // Update certificate info
    static async updateCertificateInfo(resultId, certificateUrl, certificateCode) {
        return assessmentResultsMutation_repository_1.AssessmentResultsMutationRepository.updateCertificateInfo(resultId, certificateUrl, certificateCode);
    }
    // Get user assessment history
    static async getUserAssessmentHistory(userId) {
        return assessmentResultsQuery_repository_1.AssessmentResultsQueryRepository.getUserAssessmentHistory(userId);
    }
    // Get global assessment statistics
    static async getGlobalAssessmentStats() {
        return assessmentResultsStats_repository_1.AssessmentResultsStatsRepository.getGlobalAssessmentStats();
    }
}
exports.AssessmentResultsRepository = AssessmentResultsRepository;
