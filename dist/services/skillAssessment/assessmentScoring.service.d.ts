export declare class AssessmentScoringService {
    private static readonly PASSING_SCORE;
    static calculateScore(questions: Array<{
        answer: string;
    }>, userAnswers: Array<{
        questionId: number;
        answer: string;
    }>): {
        score: number;
        correctAnswers: number;
        totalQuestions: number;
    };
    static isPassed(score: number): boolean;
    static getPerformanceLevel(score: number): {
        level: string;
        color: string;
        description: string;
    };
    static getImprovementRecommendations(score: number): string[];
    static getDetailedScoreBreakdown(questions: Array<{
        answer: string;
        category?: string;
    }>, userAnswers: Array<{
        questionId: number;
        answer: string;
    }>): {
        overall: {
            score: number;
            correctAnswers: number;
            totalQuestions: number;
        };
        categories: Map<string, {
            correct: number;
            total: number;
            percentage: number;
        }>;
    };
    static validateAnswers(answers: Array<{
        questionId: number;
        answer: string;
    }>, expectedQuestionCount: number): {
        isValid: boolean;
        errors: string[];
    };
    static getPassingScore(): number;
    static calculateTimeEfficiency(timeSpent: number, timeLimit: number): {
        efficiency: number;
        rating: string;
        description: string;
    };
}
//# sourceMappingURL=assessmentScoring.service.d.ts.map