export declare class AssessmentSubmissionService {
    private static readonly PASSING_SCORE;
    static submitAssessment(data: {
        assessmentId: number;
        userId: number;
        answers: Array<{
            questionId: number;
            answer: string;
        }>;
        timeSpent: number;
    }): Promise<{
        result: {
            id: number;
            score: number;
            correctAnswers: number;
            totalQuestions: number;
            passed: boolean;
            timeSpent: number;
            completedAt: Date;
        };
        certificate: {
            certificateUrl: string;
            certificateCode: string;
        } | null;
        badge: {
            id: number;
            userId: number;
            badgeTemplateId: number;
            assessmentId: number;
            score: number;
            earnedAt: Date;
        } | null;
    }>;
    private static saveAssessmentResult;
    private static awardBadge;
    static getUserResults(userId: number, page?: number, limit?: number): Promise<{
        results: never[];
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
    static isAssessmentPassed(score: number): boolean;
    static getAchievementLevel(score: number): {
        level: string;
        color: string;
        description: string;
    };
    static calculateTimeEfficiency(timeSpent: number, timeLimit: number): number;
    static getResultAnalysis(data: {
        score: number;
        correctAnswers: number;
        totalQuestions: number;
        timeSpent: number;
    }): {
        score: number;
        accuracy: number;
        timeEfficiency: number;
        achievement: {
            level: string;
            color: string;
            description: string;
        };
        passed: boolean;
        correctAnswers: number;
        totalQuestions: number;
        timeSpent: number;
        recommendations: string[];
    };
    private static getRecommendations;
}
//# sourceMappingURL=assessmentSubmission.service.d.ts.map