import { UserRole } from "../../generated/prisma";
export declare class PreselectionService {
    static createOrUpdateTest(params: {
        jobId: number;
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
        jobId: number;
        passingScore: number | null;
    }>;
    static getTestForJob(jobId: number, requesterRole?: UserRole): Promise<{
        id: number;
        jobId: number;
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
        jobId: number;
        requesterId: number;
        requesterRole: UserRole;
    }): Promise<{
        jobId: number;
        results: never[];
        testId?: never;
    } | {
        jobId: number;
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
}
//# sourceMappingURL=preselection.service.d.ts.map