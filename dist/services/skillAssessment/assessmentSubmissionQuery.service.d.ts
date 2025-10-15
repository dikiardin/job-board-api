export declare class AssessmentSubmissionQueryService {
    static getUserAssessmentAttempts(userId: number, assessmentId: number): Promise<{
        createdAt: Date;
        id: number;
        userId: number;
        score: number;
        assessmentId: number;
        isPassed: boolean;
    }[]>;
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
        slug: any;
        title: string;
        description: string | null;
        passScore: number;
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
        user: {
            email: string;
            name: string | null;
            id: number;
        };
        assessment: {
            id: number;
            description: string | null;
            title: string;
            passScore: number;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        slug: string;
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
    static getAllAssessmentResults(assessmentId: number, createdBy: number): Promise<{
        results: never[];
        summary: {
            totalAttempts: number;
            passedCount: number;
            averageScore: number;
            passRate: number;
            completionRate?: never;
        };
        assessment?: never;
    } | {
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
            slug: string;
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
            passedCount?: never;
        };
        assessment: {
            id: number;
            title: string;
            totalQuestions: number;
        };
    }>;
    static isAssessmentPassed(score: number, passScore?: number): boolean;
}
//# sourceMappingURL=assessmentSubmissionQuery.service.d.ts.map