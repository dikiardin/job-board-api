"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentReportsService = void 0;
const customError_1 = require("../../utils/customError");
const prisma_1 = require("../../generated/prisma");
const developerAnalytics_service_1 = require("./developerAnalytics.service");
class AssessmentReportsService {
    // Get assessment difficulty analysis
    static async getAssessmentDifficultyAnalysis(assessmentId, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access difficulty analysis", 403);
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
    static async generateAssessmentReport(assessmentId, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can generate assessment reports", 403);
        }
        const metrics = await developerAnalytics_service_1.DeveloperAnalyticsService.getAssessmentMetrics(assessmentId, userRole);
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
    static getAssessmentRecommendation(passRate, averageScore) {
        if (passRate < 50) {
            return "Consider reviewing question difficulty - pass rate is low";
        }
        else if (averageScore > 90) {
            return "Assessment may be too easy - consider adding more challenging questions";
        }
        else if (passRate > 80 && averageScore > 75) {
            return "Assessment difficulty is well-balanced";
        }
        else {
            return "Assessment performance is within acceptable range";
        }
    }
    // Generate comprehensive analytics report
    static async generateComprehensiveReport(userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can generate comprehensive reports", 403);
        }
        const certificates = await developerAnalytics_service_1.DeveloperAnalyticsService.getCertificateAnalytics(userRole);
        const badges = await developerAnalytics_service_1.DeveloperAnalyticsService.getBadgeAnalytics(userRole);
        const verification = await developerAnalytics_service_1.DeveloperAnalyticsService.getVerificationStats(userRole);
        const engagement = await developerAnalytics_service_1.DeveloperAnalyticsService.getUserEngagementAnalytics(userRole);
        const trends = await developerAnalytics_service_1.DeveloperAnalyticsService.getCertificateTrends(userRole);
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
    static generateInsights(certificates, badges, engagement) {
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
    static async generateMonthlyReport(month, year, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can generate monthly reports", 403);
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
    static async exportReport(reportId, format, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can export reports", 403);
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
    static async getReportHistory(userRole, page = 1, limit = 10) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access report history", 403);
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
exports.AssessmentReportsService = AssessmentReportsService;
//# sourceMappingURL=assessmentReports.service.js.map