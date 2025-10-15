export declare class AssessmentExecutionQueryService {
    private static readonly TIME_LIMIT_MINUTES;
    static getAssessmentForTaking(assessmentId: number, userId: number): Promise<{
        id: number;
        title: string;
        description: string;
        questions: {
            id: number;
            question: string;
            options: string[];
        }[];
        timeLimit: number;
        totalQuestions: number;
        passingScore: number;
    }>;
    static getUserInfo(userId: number): Promise<{
        name: string | null;
        email: string;
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
    }>;
    static canRetakeAssessment(userId: number, assessmentId: number): Promise<boolean>;
    static validateAssessmentExists(assessmentId: number): Promise<{
        _count: {
            questions: number;
            results: number;
        };
        questions: {
            id: number;
            options: import("../../generated/prisma/runtime/library").JsonValue;
            question: string;
            answer: string;
            orderIndex: number;
            assessmentId: number;
        }[];
        badgeTemplate: {
            name: string;
            id: number;
            description: string | null;
            category: string | null;
            icon: string | null;
        } | null;
        creator: {
            name: string | null;
            id: number;
        };
    } & {
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        slug: string;
        description: string | null;
        title: string;
        category: string;
        timeLimitMinutes: number;
        createdBy: number;
        badgeTemplateId: number | null;
        passScore: number;
    }>;
    static checkUserSubscription(userId: number): Promise<boolean>;
}
//# sourceMappingURL=assessmentExecutionQuery.service.d.ts.map