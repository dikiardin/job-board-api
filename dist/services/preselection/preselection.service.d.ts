import { UserRole } from "../../generated/prisma";
export declare class PreselectionService {
    private static dependencies;
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
    }): Promise<any>;
    static getTestForJob(jobId: string | number, requesterRole?: UserRole): Promise<{
        id: any;
        jobId: any;
        isActive: any;
        passingScore: any;
        createdAt: any;
        questions: any;
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
        resultId: any;
        score: number;
        totalQuestions: any;
        isPassed: boolean | undefined;
    }>;
    static getJobResults(params: {
        jobId: string | number;
        requesterId: number;
        requesterRole: UserRole;
    }): Promise<{
        jobId: string | number;
        results: never[];
        testId?: never;
    } | {
        jobId: any;
        testId: any;
        results: any;
    }>;
    static statusForUser(params: {
        jobId: string | number;
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
        testId: any;
        submitted: boolean;
        score: any;
        passingScore: any;
        isPassed: boolean;
    }>;
}
//# sourceMappingURL=preselection.service.d.ts.map