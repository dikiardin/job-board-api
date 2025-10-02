import { UserRole } from "../../generated/prisma";
export declare class AssessmentReportsService {
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
    private static getAssessmentRecommendation;
    static generateComprehensiveReport(userRole: UserRole): Promise<{
        reportId: string;
        generatedAt: Date;
        period: {
            from: Date;
            to: Date;
        };
        summary: {
            totalCertificates: number;
            totalBadges: number;
            totalVerifications: number;
            activeUsers: number;
        };
        sections: {
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
            trends: {
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
            };
        };
        insights: {
            type: string;
            category: string;
            message: string;
        }[];
    }>;
    private static generateInsights;
    static generateMonthlyReport(month: number, year: number, userRole: UserRole): Promise<{
        reportType: string;
        period: {
            month: number;
            year: number;
        };
        generatedAt: Date;
        metrics: {
            certificatesIssued: number;
            badgesAwarded: number;
            assessmentsCompleted: number;
            newUsers: number;
            passRate: number;
            averageScore: number;
        };
        topPerformers: {
            assessment: string;
            completions: number;
            passRate: number;
        }[];
        recommendations: string[];
    }>;
    static exportReport(reportId: string, format: 'pdf' | 'excel' | 'json', userRole: UserRole): Promise<{
        reportId: string;
        format: "pdf" | "json" | "excel";
        downloadUrl: string;
        expiresAt: Date;
        filename: string;
    }>;
    static getReportHistory(userRole: UserRole, page?: number, limit?: number): Promise<{
        reports: {
            id: string;
            type: string;
            generatedAt: Date;
            status: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
//# sourceMappingURL=assessmentReports.service.d.ts.map