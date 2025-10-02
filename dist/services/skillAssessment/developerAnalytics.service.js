"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeveloperAnalyticsService = void 0;
const customError_1 = require("../../utils/customError");
const prisma_1 = require("../../generated/prisma");
class DeveloperAnalyticsService {
    // Get assessment results for developer review
    static async getAssessmentResults(assessmentId, userId, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access assessment results", 403);
        }
        // Mock implementation to avoid repository dependency
        return {
            results: [],
            assessmentId,
            total: 0,
        };
    }
    // Get certificate analytics (Developer only)
    static async getCertificateAnalytics(userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access certificate analytics", 403);
        }
        // Mock analytics data
        return {
            totalCertificatesIssued: 150,
            certificatesThisMonth: 25,
            topPerformingAssessments: [
                { title: "JavaScript Assessment", certificates: 45 },
                { title: "Python Assessment", certificates: 32 },
                { title: "React Assessment", certificates: 28 },
            ],
            averageScores: {
                javascript: 82,
                python: 78,
                react: 85,
            },
            passRates: {
                javascript: 75,
                python: 68,
                react: 80,
            },
        };
    }
    // Get badge analytics (Developer only)
    static async getBadgeAnalytics(userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access badge analytics", 403);
        }
        // Mock analytics
        return {
            totalBadgesAwarded: 120,
            badgesThisMonth: 18,
            topBadges: [
                { title: "JavaScript Expert", awarded: 35 },
                { title: "Python Master", awarded: 28 },
                { title: "React Specialist", awarded: 22 },
            ],
            badgesByCategory: {
                programming: 85,
                frameworks: 25,
                databases: 10,
            },
        };
    }
    // Get verification statistics
    static async getVerificationStats(userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access verification statistics", 403);
        }
        // Mock verification stats
        return {
            totalVerifications: 500,
            verificationsToday: 12,
            verificationsThisWeek: 85,
            verificationsThisMonth: 320,
            topVerifiedCertificates: [
                { certificateCode: "CERT-ABC123", verifications: 25 },
                { certificateCode: "CERT-DEF456", verifications: 18 },
                { certificateCode: "CERT-GHI789", verifications: 15 },
            ],
        };
    }
    // Get assessment performance metrics
    static async getAssessmentMetrics(assessmentId, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access assessment metrics", 403);
        }
        // Mock metrics
        return {
            totalAttempts: 150,
            uniqueUsers: 120,
            averageScore: 78.5,
            passRate: 72,
            averageTimeSpent: 22.5, // minutes
            difficultyRating: 3.2, // out of 5
            completionRate: 85, // percentage who finish
            retakeRate: 15, // percentage who retake
        };
    }
    // Get user engagement analytics
    static async getUserEngagementAnalytics(userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access user engagement analytics", 403);
        }
        return {
            activeUsers: {
                daily: 45,
                weekly: 180,
                monthly: 650,
            },
            assessmentTrends: {
                thisMonth: 125,
                lastMonth: 98,
                growth: 27.6, // percentage
            },
            popularAssessments: [
                { title: "JavaScript Assessment", attempts: 89 },
                { title: "Python Assessment", attempts: 67 },
                { title: "React Assessment", attempts: 54 },
            ],
            userRetention: {
                day1: 85,
                day7: 62,
                day30: 45,
            },
        };
    }
    // Get certificate trends
    static async getCertificateTrends(userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access certificate trends", 403);
        }
        return {
            monthlyIssuance: [
                { month: "Jan", certificates: 12 },
                { month: "Feb", certificates: 18 },
                { month: "Mar", certificates: 25 },
                { month: "Apr", certificates: 22 },
                { month: "May", certificates: 30 },
            ],
            topSkills: [
                { skill: "JavaScript", certificates: 45, growth: 15 },
                { skill: "Python", certificates: 32, growth: 8 },
                { skill: "React", certificates: 28, growth: 22 },
            ],
            industryDemand: {
                "Web Development": 65,
                "Data Science": 25,
                "Mobile Development": 10,
            },
        };
    }
    // Export analytics data
    static async exportAnalyticsData(userRole, format = 'json') {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can export analytics data", 403);
        }
        const data = {
            certificates: await this.getCertificateAnalytics(userRole),
            badges: await this.getBadgeAnalytics(userRole),
            verification: await this.getVerificationStats(userRole),
            engagement: await this.getUserEngagementAnalytics(userRole),
            exportedAt: new Date(),
        };
        return {
            format,
            data,
            filename: `skill-assessment-analytics-${new Date().toISOString().split('T')[0]}.${format}`,
        };
    }
}
exports.DeveloperAnalyticsService = DeveloperAnalyticsService;
//# sourceMappingURL=developerAnalytics.service.js.map