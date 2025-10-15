export declare class SkillAssessmentResultsRepository {
    static saveAssessmentResult(data: {
        userId: number;
        assessmentId: number;
        score: number;
        isPassed: boolean;
        certificateUrl?: string;
        certificateCode?: string;
    }): Promise<{
        user: {
            email: string;
            name: string | null;
            id: number;
        };
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
    static verifyCertificate(certificateCode: string): Promise<({
        user: {
            email: string;
            name: string | null;
            id: number;
        };
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
    static getUserCertificates(userId: number, page?: number, limit?: number): Promise<{
        certificates: ({
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
    static getAssessmentStats(assessmentId: number): Promise<{
        totalAttempts: number;
        averageScore: number;
        passRate: number;
        averageTimeSpent: number;
    }>;
    static updateCertificateInfo(resultId: number, certificateUrl: string, certificateCode: string): Promise<{
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
    static getCertificateByCode(certificateCode: string): Promise<({
        user: {
            email: string;
            name: string | null;
            id: number;
        };
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
    static getUserAssessmentAttempts(userId: number, assessmentId: number): Promise<{
        createdAt: Date;
        id: number;
        userId: number;
        score: number;
        assessmentId: number;
        isPassed: boolean;
    }[]>;
}
//# sourceMappingURL=skillAssessmentResults.repository.d.ts.map