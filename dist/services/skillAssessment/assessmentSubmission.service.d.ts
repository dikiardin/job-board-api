export declare class AssessmentSubmissionService {
    static submitAssessment(data: {
        assessmentId: number;
        userId: number;
        answers: Array<{
            questionId: number;
            answer: string;
        }>;
        timeSpent: number;
    }): Promise<{
        result: {
            id: number;
            score: number;
            correctAnswers: number;
            totalQuestions: number;
            passed: boolean;
            timeSpent: number;
            completedAt: Date;
        };
        certificate: {
            certificateUrl: string;
            certificateCode: string;
        } | null;
    }>;
    private static validateSubmission;
    private static generateCertificate;
    private static saveAssessmentResult;
    static getUserResults(userId: number, page?: number, limit?: number): Promise<{
        results: never[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static checkAssessmentExists(assessmentId: number): Promise<boolean>;
    static getAssessmentForTaking(assessmentId: number): Promise<{
        id: number;
        title: string;
        description: string | null;
        questions: {
            id: any;
            question: any;
            options: any;
        }[];
        badgeTemplate: {
            name: string;
            id: number;
            description: string | null;
            category: string | null;
            icon: string | null;
        } | null;
        creator: {
            name: string | null;
            id: number;
        };
    }>;
    static getAssessmentResult(userId: number, assessmentId: number): Promise<{
        assessment: {
            id: number;
            description: string | null;
            title: string;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        answers: import("../../generated/prisma/runtime/library").JsonValue | null;
        score: number;
        assessmentId: number;
        isPassed: boolean;
        startedAt: Date | null;
        finishedAt: Date | null;
        durationSeconds: number | null;
        certificateUrl: string | null;
        certificateCode: string | null;
    }>;
    static getAllAssessmentResults(assessmentId: number): Promise<{
        results: ({
            user: {
                email: string;
                name: string | null;
                id: number;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            answers: import("../../generated/prisma/runtime/library").JsonValue | null;
            score: number;
            assessmentId: number;
            isPassed: boolean;
            startedAt: Date | null;
            finishedAt: Date | null;
            durationSeconds: number | null;
            certificateUrl: string | null;
            certificateCode: string | null;
        })[];
        summary: {
            totalAttempts: number;
            averageScore: number;
            passRate: number;
            completionRate: number;
        };
        assessment: {
            id: number;
            title: string;
            totalQuestions: number;
        };
    }>;
    static isAssessmentPassed(score: number): boolean;
}
//# sourceMappingURL=assessmentSubmission.service.d.ts.map