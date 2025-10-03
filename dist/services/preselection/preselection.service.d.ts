import { UserRole } from "../../generated/prisma";
export declare class PreselectionService {
    static createOrUpdateTest(params: {
        jobId: string;
        requesterId: number;
        requesterRole: UserRole;
        questions: Array<{
            question: string;
            options: string[];
            answer: string;
        }>;
        passingScore?: number;
        isActive?: boolean;
    }): Promise<{
        questions: {
            id: number;
            options: import("../../generated/prisma/runtime/library").JsonValue;
            question: string;
            answer: string;
            testId: number;
        }[];
    } & {
        createdAt: Date;
        id: number;
        isActive: boolean;
        jobId: string;
        passingScore: number | null;
    }>;
    private static validateAdminAccess;
    private static validateJobOwnership;
    private static validateQuestions;
    private static validateQuestion;
    private static validatePassingScore;
    static getTestForJob(jobId: string, requesterRole?: UserRole): Promise<{
        id: number;
        jobId: string;
        isActive: boolean;
        passingScore: number | null;
        createdAt: Date;
        questions: {
            answer?: string;
            id: number;
            question: string;
            options: string[];
        }[];
    }>;
    static submitAnswers(params: {
        applicantId: number;
        pathApplicantId: number;
        testId: number;
        requesterRole: UserRole;
        answers: Array<{
            questionId: number;
            selected: string;
        }>;
    }): Promise<{
        resultId: number;
        score: number;
        totalQuestions: number;
        isPassed: boolean | undefined;
    }>;
    static getJobResults(params: {
        jobId: string;
        requesterId: number;
        requesterRole: UserRole;
    }): Promise<{
        jobId: string;
        results: never[];
        testId?: never;
    } | {
        jobId: string;
        testId: number;
        results: {
            resultId: number;
            user: {
                id: number;
                name: string;
                email: string;
            };
            score: number;
            submittedAt: Date;
        }[];
    }>;
    static statusForUser(params: {
        jobId: string;
        userId: number;
    }): Promise<{
        required: boolean;
        testId?: never;
        submitted?: never;
        score?: never;
        passingScore?: never;
        isPassed?: never;
    } | {
        required: boolean;
        testId: number;
        submitted: boolean;
        score: number | null;
        passingScore: number | null;
        isPassed: boolean;
    }>;
}
//# sourceMappingURL=preselection.service.d.ts.map