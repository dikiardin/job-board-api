import { UserRole } from "../../generated/prisma";
export declare class PreselectionTestService {
    static createOrUpdateTest(params: {
        jobId: string | number;
        requesterId: number;
        requesterRole: UserRole;
        questions: Array<{
            question: string;
            options: string[];
            answer: string;
        }>;
        passingScore?: number;
        isActive?: boolean;
    }, dependencies: {
        validateAdminAccess: (role: UserRole) => void;
        validateJobOwnership: (jobId: string | number, requesterId: number) => Promise<void>;
        validateQuestions: (questions: Array<{
            question: string;
            options: string[];
            answer: string;
        }>) => void;
        validatePassingScore: (passingScore: number | undefined, questionCount: number) => void;
        upsertTest: (jobId: string | number, questions: Array<{
            question: string;
            options: string[];
            answer: string;
        }>, passingScore?: number, isActive?: boolean) => Promise<any>;
    }): Promise<any>;
    static getTestForJob(jobId: string | number, requesterRole: UserRole | undefined, dependencies: {
        getTestByJobId: (jobId: string | number) => Promise<any>;
    }): Promise<{
        id: any;
        jobId: any;
        isActive: any;
        passingScore: any;
        createdAt: any;
        questions: any;
    }>;
    static statusForUser(params: {
        jobId: string | number;
        userId: number;
    }, dependencies: {
        getTestByJobId: (jobId: string | number) => Promise<any>;
        getResult: (userId: number, testId: number) => Promise<any>;
    }): Promise<{
        required: boolean;
        testId?: never;
        submitted?: never;
        score?: never;
        passingScore?: never;
        isPassed?: never;
    } | {
        required: boolean;
        testId: any;
        submitted: boolean;
        score: any;
        passingScore: any;
        isPassed: boolean;
    }>;
}
//# sourceMappingURL=test.service.d.ts.map