export declare class ScoringCalculationService {
    private static readonly DEFAULT_PASSING_SCORE;
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
    private static countCorrectAnswers;
    static isPassed(score: number, passScore?: number): boolean;
    static getPassingScore(passScore?: number): number;
    static calculateTimeEfficiency(timeSpent: number, timeLimit: number): {
        efficiency: number;
        rating: string;
        description: string;
    };
}
//# sourceMappingURL=scoringCalculation.service.d.ts.map