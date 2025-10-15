export declare class AssessmentExecutionValidationService {
    private static readonly TIME_LIMIT_MINUTES;
    static validateSubmission(data: {
        assessmentId: number;
        userId: number;
        answers: Array<{
            questionId: number;
            answer: string;
        }>;
        timeSpent: number;
    }): void;
    static getTimeRemaining(startTime: Date): number;
    static getTimeLimit(): number;
}
//# sourceMappingURL=assessmentExecutionValidation.service.d.ts.map