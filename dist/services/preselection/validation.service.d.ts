import { UserRole } from "../../generated/prisma";
export declare class PreselectionValidationService {
    static validateAdminAccess(requesterRole: UserRole): void;
    static validateJobOwnership(jobId: string | number, requesterId: number, getJob: (jobId: string | number) => Promise<any>): Promise<void>;
    static validateQuestions(questions: Array<{
        question: string;
        options: string[];
        answer: string;
    }>): void;
    static validateQuestion(q: {
        question: string;
        options: string[];
        answer: string;
    }, questionNumber: number): void;
    static validatePassingScore(passingScore: number | undefined, questionCount: number): void;
    static validateSubmissionAccess(requesterRole: UserRole, applicantId: number, pathApplicantId: number): void;
    static validateTestForSubmission(test: any): void;
    static validateAnswers(answers: Array<{
        questionId: number;
        selected: string;
    }>, testQuestions: any[]): void;
    static validateAnswerOption(selected: string, options: string[], questionId: number): void;
}
//# sourceMappingURL=validation.service.d.ts.map