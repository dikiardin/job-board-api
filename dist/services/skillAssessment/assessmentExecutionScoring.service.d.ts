export declare class AssessmentExecutionScoringService {
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
    static getPassingScore(assessmentPassScore?: number): number;
}
//# sourceMappingURL=assessmentExecutionScoring.service.d.ts.map