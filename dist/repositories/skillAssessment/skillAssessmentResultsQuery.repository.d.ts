export declare class SkillAssessmentResultsQueryRepository {
    static getResultBySlug(slug: string): Promise<({
        user: {
            email: string;
            name: string | null;
            id: number;
        };
        assessment: {
            id: number;
            slug: string;
            description: string | null;
            title: string;
            badgeTemplate: {
                name: string;
                id: number;
                category: string | null;
                icon: string | null;
            } | null;
            passScore: number;
            creator: {
                name: string | null;
                id: number;
            };
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
    }) | null>;
    static getUserResult(userId: number, assessmentId: number): Promise<({
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
    }) | null>;
    static getUserResults(userId: number, page?: number, limit?: number): Promise<{
        results: ({
            assessment: {
                id: number;
                description: string | null;
                title: string;
                badgeTemplate: {
                    name: string;
                    id: number;
                    category: string | null;
                    icon: string | null;
                } | null;
                passScore: number;
                creator: {
                    name: string | null;
                    id: number;
                };
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
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getAssessmentResults(assessmentId: number, createdBy: number): Promise<({
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
    })[] | null>;
    static getAssessmentLeaderboard(assessmentId: number, limit?: number): Promise<({
        user: {
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
    })[]>;
    static getUserAssessmentAttempts(userId: number, assessmentId: number): Promise<{
        createdAt: Date;
        id: number;
        userId: number;
        score: number;
        assessmentId: number;
        isPassed: boolean;
    }[]>;
}
//# sourceMappingURL=skillAssessmentResultsQuery.repository.d.ts.map