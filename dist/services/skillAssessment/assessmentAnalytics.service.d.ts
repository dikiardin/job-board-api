import { UserRole } from "../../generated/prisma";
export declare class AssessmentAnalyticsService {
    static getAssessmentResults(assessmentId: number, userId: number, userRole: UserRole): Promise<{
        results: never[];
        assessmentId: number;
        total: number;
    }>;
    static getCertificateAnalytics(userRole: UserRole): Promise<{
        totalCertificatesIssued: number;
        certificatesThisMonth: number;
        topPerformingAssessments: {
            title: string;
            certificates: number;
        }[];
        averageScores: {
            javascript: number;
            python: number;
            react: number;
        };
        passRates: {
            javascript: number;
            python: number;
            react: number;
        };
    }>;
    static getBadgeAnalytics(userRole: UserRole): Promise<{
        totalBadgesAwarded: number;
        badgesThisMonth: number;
        topBadges: {
            title: string;
            awarded: number;
        }[];
        badgesByCategory: {
            programming: number;
            frameworks: number;
            databases: number;
        };
    }>;
    static getVerificationStats(userRole: UserRole): Promise<{
        totalVerifications: number;
        verificationsToday: number;
        verificationsThisWeek: number;
        verificationsThisMonth: number;
        topVerifiedCertificates: {
            certificateCode: string;
            verifications: number;
        }[];
    }>;
    static getAssessmentMetrics(assessmentId: number, userRole: UserRole): Promise<{
        totalAttempts: number;
        uniqueUsers: number;
        averageScore: number;
        passRate: number;
        averageTimeSpent: number;
        difficultyRating: number;
        completionRate: number;
        retakeRate: number;
    }>;
    static getUserEngagementAnalytics(userRole: UserRole): Promise<{
        activeUsers: {
            daily: number;
            weekly: number;
            monthly: number;
        };
        assessmentTrends: {
            thisMonth: number;
            lastMonth: number;
            growth: number;
        };
        popularAssessments: {
            title: string;
            attempts: number;
        }[];
        userRetention: {
            day1: number;
            day7: number;
            day30: number;
        };
    }>;
    static getCertificateTrends(userRole: UserRole): Promise<{
        monthlyIssuance: {
            month: string;
            certificates: number;
        }[];
        topSkills: {
            skill: string;
            certificates: number;
            growth: number;
        }[];
        industryDemand: {
            "Web Development": number;
            "Data Science": number;
            "Mobile Development": number;
        };
    }>;
    static exportAnalyticsData(userRole: UserRole, format?: 'json' | 'csv'): Promise<{
        format: "json" | "csv";
        data: {
            certificates: {
                totalCertificatesIssued: number;
                certificatesThisMonth: number;
                topPerformingAssessments: {
                    title: string;
                    certificates: number;
                }[];
                averageScores: {
                    javascript: number;
                    python: number;
                    react: number;
                };
                passRates: {
                    javascript: number;
                    python: number;
                    react: number;
                };
            };
            badges: {
                totalBadgesAwarded: number;
                badgesThisMonth: number;
                topBadges: {
                    title: string;
                    awarded: number;
                }[];
                badgesByCategory: {
                    programming: number;
                    frameworks: number;
                    databases: number;
                };
            };
            verification: {
                totalVerifications: number;
                verificationsToday: number;
                verificationsThisWeek: number;
                verificationsThisMonth: number;
                topVerifiedCertificates: {
                    certificateCode: string;
                    verifications: number;
                }[];
            };
            engagement: {
                activeUsers: {
                    daily: number;
                    weekly: number;
                    monthly: number;
                };
                assessmentTrends: {
                    thisMonth: number;
                    lastMonth: number;
                    growth: number;
                };
                popularAssessments: {
                    title: string;
                    attempts: number;
                }[];
                userRetention: {
                    day1: number;
                    day7: number;
                    day30: number;
                };
            };
            exportedAt: Date;
        };
        filename: string;
    }>;
    static getAssessmentDifficultyAnalysis(assessmentId: number, userRole: UserRole): Promise<{
        averageScore: number;
        scoreDistribution: {
            "90-100": number;
            "80-89": number;
            "70-79": number;
            "60-69": number;
            "below-60": number;
        };
        questionDifficulty: {
            questionId: number;
            correctRate: number;
            difficulty: string;
        }[];
        timeAnalysis: {
            averageTimePerQuestion: number;
            fastestCompletion: number;
            slowestCompletion: number;
        };
    }>;
    static generateAssessmentReport(assessmentId: number, userRole: UserRole): Promise<{
        assessmentId: number;
        generatedAt: Date;
        summary: {
            totalAttempts: number;
            passRate: number;
            averageScore: number;
            recommendation: string;
        };
        metrics: {
            totalAttempts: number;
            uniqueUsers: number;
            averageScore: number;
            passRate: number;
            averageTimeSpent: number;
            difficultyRating: number;
            completionRate: number;
            retakeRate: number;
        };
        difficulty: {
            averageScore: number;
            scoreDistribution: {
                "90-100": number;
                "80-89": number;
                "70-79": number;
                "60-69": number;
                "below-60": number;
            };
            questionDifficulty: {
                questionId: number;
                correctRate: number;
                difficulty: string;
            }[];
            timeAnalysis: {
                averageTimePerQuestion: number;
                fastestCompletion: number;
                slowestCompletion: number;
            };
        };
    }>;
}
//# sourceMappingURL=assessmentAnalytics.service.d.ts.map