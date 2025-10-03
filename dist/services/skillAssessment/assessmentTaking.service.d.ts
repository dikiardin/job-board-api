export declare class AssessmentTakingService {
    private static readonly PASSING_SCORE;
    private static readonly TIME_LIMIT_MINUTES;
    static getAssessmentForTaking(assessmentId: number, userId: number): Promise<{
        id: number;
        title: string;
        description: string;
        questions: {
            id: any;
            question: any;
            options: any;
        }[];
        timeLimit: number;
        totalQuestions: number;
        passingScore: number;
    }>;
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
    private static calculateScore;
    private static checkUserSubscription;
    private static getUserInfo;
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
    static getAssessmentLeaderboard(assessmentId: number, limit?: number): Promise<{
        leaderboard: never[];
        assessmentId: number;
        limit: number;
    }>;
    static getAssessmentStats(assessmentId: number): Promise<{
        totalAttempts: number;
        averageScore: number;
        passRate: number;
        averageTimeSpent: number;
    }>;
    static retakeAssessment(userId: number, assessmentId: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=assessmentTaking.service.d.ts.map