import { DeveloperAnalyticsService } from "./developerAnalytics.service";
import { AssessmentReportsService } from "./assessmentReports.service";
import { UserRole } from "../../generated/prisma";

export class AssessmentAnalyticsService {
  // Delegate to DeveloperAnalyticsService
  public static async getAssessmentResults(assessmentId: number, userId: number, userRole: UserRole) {
    return await DeveloperAnalyticsService.getAssessmentResults(assessmentId, userId, userRole);
  }

  public static async getCertificateAnalytics(userRole: UserRole) {
    return await DeveloperAnalyticsService.getCertificateAnalytics(userRole);
  }

  public static async getBadgeAnalytics(userRole: UserRole) {
    return await DeveloperAnalyticsService.getBadgeAnalytics(userRole);
  }

  public static async getVerificationStats(userRole: UserRole) {
    return await DeveloperAnalyticsService.getVerificationStats(userRole);
  }

  public static async getAssessmentMetrics(assessmentId: number, userRole: UserRole) {
    return await DeveloperAnalyticsService.getAssessmentMetrics(assessmentId, userRole);
  }

  public static async getUserEngagementAnalytics(userRole: UserRole) {
    return await DeveloperAnalyticsService.getUserEngagementAnalytics(userRole);
  }

  public static async getCertificateTrends(userRole: UserRole) {
    return await DeveloperAnalyticsService.getCertificateTrends(userRole);
  }

  public static async exportAnalyticsData(userRole: UserRole, format: 'json' | 'csv' = 'json') {
    return await DeveloperAnalyticsService.exportAnalyticsData(userRole, format);
  }

  // Delegate to AssessmentReportsService
  public static async getAssessmentDifficultyAnalysis(assessmentId: number, userRole: UserRole) {
    return await AssessmentReportsService.getAssessmentDifficultyAnalysis(assessmentId, userRole);
  }

  public static async generateAssessmentReport(assessmentId: number, userRole: UserRole) {
    return await AssessmentReportsService.generateAssessmentReport(assessmentId, userRole);
  }
}
