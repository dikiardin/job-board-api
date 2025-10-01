import { CustomError } from "../../utils/customError";
import { UserRole } from "../../generated/prisma";
import { DeveloperAnalyticsService } from "./developerAnalytics.service";

export class AssessmentReportsService {
  // Get assessment difficulty analysis
  public static async getAssessmentDifficultyAnalysis(assessmentId: number, userRole: UserRole) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can access difficulty analysis", 403);
    }

    return {
      averageScore: 78.5,
      scoreDistribution: {
        "90-100": 15,
        "80-89": 25,
        "70-79": 30,
        "60-69": 20,
        "below-60": 10,
      },
      questionDifficulty: [
        { questionId: 1, correctRate: 85, difficulty: "Easy" },
        { questionId: 2, correctRate: 45, difficulty: "Hard" },
        { questionId: 3, correctRate: 72, difficulty: "Medium" },
      ],
      timeAnalysis: {
        averageTimePerQuestion: 1.2, // minutes
        fastestCompletion: 15, // minutes
        slowestCompletion: 30, // minutes
      },
    };
  }

  // Generate assessment report
  public static async generateAssessmentReport(assessmentId: number, userRole: UserRole) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can generate assessment reports", 403);
    }

    const metrics = await DeveloperAnalyticsService.getAssessmentMetrics(assessmentId, userRole);
    const difficulty = await this.getAssessmentDifficultyAnalysis(assessmentId, userRole);

    return {
      assessmentId,
      generatedAt: new Date(),
      summary: {
        totalAttempts: metrics.totalAttempts,
        passRate: metrics.passRate,
        averageScore: metrics.averageScore,
        recommendation: this.getAssessmentRecommendation(metrics.passRate, metrics.averageScore),
      },
      metrics,
      difficulty,
    };
  }

  // Get assessment recommendation based on performance
  private static getAssessmentRecommendation(passRate: number, averageScore: number): string {
    if (passRate < 50) {
      return "Consider reviewing question difficulty - pass rate is low";
    } else if (averageScore > 90) {
      return "Assessment may be too easy - consider adding more challenging questions";
    } else if (passRate > 80 && averageScore > 75) {
      return "Assessment difficulty is well-balanced";
    } else {
      return "Assessment performance is within acceptable range";
    }
  }

  // Generate comprehensive analytics report
  public static async generateComprehensiveReport(userRole: UserRole) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can generate comprehensive reports", 403);
    }

    const certificates = await DeveloperAnalyticsService.getCertificateAnalytics(userRole);
    const badges = await DeveloperAnalyticsService.getBadgeAnalytics(userRole);
    const verification = await DeveloperAnalyticsService.getVerificationStats(userRole);
    const engagement = await DeveloperAnalyticsService.getUserEngagementAnalytics(userRole);
    const trends = await DeveloperAnalyticsService.getCertificateTrends(userRole);

    return {
      reportId: `RPT-${Date.now()}`,
      generatedAt: new Date(),
      period: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        to: new Date(),
      },
      summary: {
        totalCertificates: certificates.totalCertificatesIssued,
        totalBadges: badges.totalBadgesAwarded,
        totalVerifications: verification.totalVerifications,
        activeUsers: engagement.activeUsers.monthly,
      },
      sections: {
        certificates,
        badges,
        verification,
        engagement,
        trends,
      },
      insights: this.generateInsights(certificates, badges, engagement),
    };
  }

  // Generate insights from analytics data
  private static generateInsights(certificates: any, badges: any, engagement: any) {
    const insights = [];

    // Certificate insights
    if (certificates.certificatesThisMonth > 20) {
      insights.push({
        type: "positive",
        category: "certificates",
        message: "Certificate issuance is performing well this month",
      });
    }

    // Badge insights
    if (badges.badgesThisMonth < 10) {
      insights.push({
        type: "warning",
        category: "badges",
        message: "Badge awards are lower than expected this month",
      });
    }

    // Engagement insights
    if (engagement.assessmentTrends.growth > 20) {
      insights.push({
        type: "positive",
        category: "engagement",
        message: "Assessment participation is growing significantly",
      });
    }

    return insights;
  }

  // Generate monthly report
  public static async generateMonthlyReport(month: number, year: number, userRole: UserRole) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can generate monthly reports", 403);
    }

    return {
      reportType: "monthly",
      period: { month, year },
      generatedAt: new Date(),
      metrics: {
        certificatesIssued: 25,
        badgesAwarded: 18,
        assessmentsCompleted: 125,
        newUsers: 45,
        passRate: 72,
        averageScore: 78.5,
      },
      topPerformers: [
        { assessment: "JavaScript", completions: 89, passRate: 85 },
        { assessment: "Python", completions: 67, passRate: 78 },
        { assessment: "React", completions: 54, passRate: 82 },
      ],
      recommendations: [
        "Consider promoting Python assessments to increase participation",
        "JavaScript assessment is performing excellently",
        "Review React assessment difficulty based on high pass rate",
      ],
    };
  }

  // Export report data
  public static async exportReport(reportId: string, format: 'pdf' | 'excel' | 'json', userRole: UserRole) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can export reports", 403);
    }

    return {
      reportId,
      format,
      downloadUrl: `/api/reports/${reportId}/download?format=${format}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      filename: `assessment-report-${reportId}.${format}`,
    };
  }

  // Get report history
  public static async getReportHistory(userRole: UserRole, page: number = 1, limit: number = 10) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can access report history", 403);
    }

    // Mock report history
    return {
      reports: [
        {
          id: "RPT-001",
          type: "comprehensive",
          generatedAt: new Date(),
          status: "completed",
        },
        {
          id: "RPT-002",
          type: "monthly",
          generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          status: "completed",
        },
      ],
      pagination: {
        page,
        limit,
        total: 2,
        totalPages: 1,
      },
    };
  }
}
