import { UserRole } from "../../generated/prisma";
export declare class PreselectionResultService {
    static submitAnswers(params: {
        applicantId: number;
        pathApplicantId: number;
        testId: number;
        requesterRole: UserRole;
        answers: Array<{
            questionId: number;
            selected: string;
        }>;
    }, dependencies: {
        validateSubmissionAccess: (requesterRole: UserRole, applicantId: number, pathApplicantId: number) => void;
        getTestById: (testId: number) => Promise<any>;
        validateTestForSubmission: (test: any) => void;
        getResult: (applicantId: number, testId: number) => Promise<any>;
        validateAnswers: (answers: Array<{
            questionId: number;
            selected: string;
        }>, testQuestions: any[]) => void;
        validateAnswerOption: (selected: string, options: string[], questionId: number) => void;
        createResult: (applicantId: number, testId: number, score: number, answers: Array<{
            questionId: number;
            selected: string;
            isCorrect: boolean;
        }>) => Promise<any>;
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
    }, dependencies: {
        validateAdminAccess: (role: UserRole) => void;
        validateJobOwnership: (jobId: string | number, requesterId: number) => Promise<void>;
        getTestResultsByJob: (jobId: string | number) => Promise<any>;
    }): Promise<{
        jobId: string | number;
        results: never[];
        testId?: never;
    } | {
        jobId: any;
        testId: any;
        results: any;
    }>;
}
//# sourceMappingURL=result.service.d.ts.map