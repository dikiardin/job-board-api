export declare class AssessmentResultsService {
    private static readonly PASSING_SCORE;
    static getUserResults(userId: number, page?: number, limit?: number): Promise<{
        results: ({
            assessment: {
                id: number;
                description: string | null;
                title: string;
                badgeTemplate: {
                    name: string;
                    id: number;
                    category: string | null;
                    icon: string | null;
                } | null;
                creator: {
                    name: string | null;
                    id: number;
                };
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            answers: import("../../generated/prisma/runtime/library").JsonValue | null;
            score: number;
            assessmentId: number;
            isPassed: boolean;
            startedAt: Date | null;
            finishedAt: Date | null;
            durationSeconds: number | null;
            certificateUrl: string | null;
            certificateCode: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getAssessmentResult(userId: number, assessmentId: number): Promise<{
        assessment: {
            id: number;
            description: string | null;
            title: string;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        answers: import("../../generated/prisma/runtime/library").JsonValue | null;
        score: number;
        assessmentId: number;
        isPassed: boolean;
        startedAt: Date | null;
        finishedAt: Date | null;
        durationSeconds: number | null;
        certificateUrl: string | null;
        certificateCode: string | null;
    }>;
    static getAssessmentLeaderboard(assessmentId: number, limit?: number): Promise<({
        user: {
            email: string;
            name: string | null;
            id: number;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        answers: import("../../generated/prisma/runtime/library").JsonValue | null;
        score: number;
        assessmentId: number;
        isPassed: boolean;
        startedAt: Date | null;
        finishedAt: Date | null;
        durationSeconds: number | null;
        certificateUrl: string | null;
        certificateCode: string | null;
    })[]>;
    static getAssessmentStats(assessmentId: number): Promise<{
        totalAttempts: number;
        averageScore: number;
        passRate: number;
    }>;
    static retakeAssessment(userId: number, assessmentId: number): Promise<{
        message: string;
    }>;
    static canRetakeAssessment(userId: number, assessmentId: number): Promise<boolean>;
    static getUserAssessmentHistory(userId: number): Promise<{
        totalAssessments: number;
        passedAssessments: number;
        failedAssessments: number;
        averageScore: number;
        recentResults: never[];
    }>;
    static getPerformanceAnalytics(userId: number): Promise<{
        totalAttempts: number;
        passRate: number;
        averageScore: number;
        strongAreas: never[];
        improvementAreas: never[];
        monthlyProgress: never[];
    }>;
    static getCertificateInfo(userId: number, assessmentId: number): Promise<{
        certificateCode: string | null;
        certificateUrl: string | null;
        issuedAt: Date;
        score: number;
    }>;
    static getAssessmentFeedback(score: number, correctAnswers: number, totalQuestions: number): {
        overall: string;
        strengths: string[];
        improvements: string[];
        nextSteps: string[];
    };
    static calculateScoreBreakdown(answers: Array<{
        questionId: number;
        answer: string;
        isCorrect: boolean;
        topic?: string;
    }>): {
        overallScore: number;
        correctAnswers: number;
        totalQuestions: number;
        accuracy: number;
        topicBreakdown: {
            topic: string;
            correct: number;
            total: number;
            percentage: number;
        }[];
    };
    static getPassingScore(): number;
    static isPassingScore(score: number): boolean;
}
//# sourceMappingURL=assessmentResults.service.d.ts.map