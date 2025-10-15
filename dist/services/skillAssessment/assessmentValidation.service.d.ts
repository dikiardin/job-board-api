import { UserRole } from "../../generated/prisma";
export declare class AssessmentValidationService {
    static validateDeveloperRole(userRole: UserRole): void;
    static validateQuestions(questions: Array<{
        question: string;
        options: string[];
        answer: string;
    }>): void;
    private static validateSingleQuestion;
    static validateTimeLimit(startedAt: Date, finishedAt: Date): void;
    static validateAnswerCount(answersCount: number, totalQuestions: number): void;
}
//# sourceMappingURL=assessmentValidation.service.d.ts.map