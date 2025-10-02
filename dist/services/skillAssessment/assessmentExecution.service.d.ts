export declare class AssessmentExecutionService {
    private static readonly PASSING_SCORE;
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
    static calculateScore(questions: Array<{
        id: number;
        answer: string;
    }>, userAnswers: Array<{
        questionId: number;
        answer: string;
    }>): {
        score: number;
        correctAnswers: number;
        totalQuestions: number;
    };
    static checkUserSubscription(userId: number): Promise<boolean>;
    static getUserInfo(userId: number): Promise<{
        name: string;
        email: string;
    }>;
    static validateSubmission(data: {
        assessmentId: number;
        userId: number;
        answers: Array<{
            questionId: number;
            answer: string;
        }>;
        timeSpent: number;
    }): void;
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
    static resetAssessmentForRetake(userId: number, assessmentId: number): Promise<{
        message: string;
    }>;
    static getTimeRemaining(startTime: Date): number;
    static validateAssessmentExists(assessmentId: number): Promise<{
        questions: {
            id: number;
            question: string;
            answer: string;
            options: string[];
        }[];
        _count: {
            results: number;
        };
        creator: {
            name: string;
            id: number;
        };
        createdAt: Date;
        id: number;
        description: string | null;
        title: string;
        createdBy: number;
        badgeTemplateId: number | null;
    }>;
    static getPassingScore(): number;
    static getTimeLimit(): number;
}
//# sourceMappingURL=assessmentExecution.service.d.ts.map