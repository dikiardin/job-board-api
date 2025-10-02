"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentAnalyticsService = void 0;
const developerAnalytics_service_1 = require("./developerAnalytics.service");
const assessmentReports_service_1 = require("./assessmentReports.service");
class AssessmentAnalyticsService {
    // Delegate to DeveloperAnalyticsService
    static async getAssessmentResults(assessmentId, userId, userRole) {
        return await developerAnalytics_service_1.DeveloperAnalyticsService.getAssessmentResults(assessmentId, userId, userRole);
    }
    static async getCertificateAnalytics(userRole) {
        return await developerAnalytics_service_1.DeveloperAnalyticsService.getCertificateAnalytics(userRole);
    }
    static async getBadgeAnalytics(userRole) {
        return await developerAnalytics_service_1.DeveloperAnalyticsService.getBadgeAnalytics(userRole);
    }
    static async getVerificationStats(userRole) {
        return await developerAnalytics_service_1.DeveloperAnalyticsService.getVerificationStats(userRole);
    }
    static async getAssessmentMetrics(assessmentId, userRole) {
        return await developerAnalytics_service_1.DeveloperAnalyticsService.getAssessmentMetrics(assessmentId, userRole);
    }
    static async getUserEngagementAnalytics(userRole) {
        return await developerAnalytics_service_1.DeveloperAnalyticsService.getUserEngagementAnalytics(userRole);
    }
    static async getCertificateTrends(userRole) {
        return await developerAnalytics_service_1.DeveloperAnalyticsService.getCertificateTrends(userRole);
    }
    static async exportAnalyticsData(userRole, format = 'json') {
        return await developerAnalytics_service_1.DeveloperAnalyticsService.exportAnalyticsData(userRole, format);
    }
    // Delegate to AssessmentReportsService
    static async getAssessmentDifficultyAnalysis(assessmentId, userRole) {
        return await assessmentReports_service_1.AssessmentReportsService.getAssessmentDifficultyAnalysis(assessmentId, userRole);
    }
    static async generateAssessmentReport(assessmentId, userRole) {
        return await assessmentReports_service_1.AssessmentReportsService.generateAssessmentReport(assessmentId, userRole);
    }
}
exports.AssessmentAnalyticsService = AssessmentAnalyticsService;
//# sourceMappingURL=assessmentAnalytics.service.js.map