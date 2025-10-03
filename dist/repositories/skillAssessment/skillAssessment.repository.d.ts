export declare class SkillAssessmentRepository {
    static createAssessment(data: any): Promise<{
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        slug: string;
        description: string | null;
        title: string;
        category: string;
        timeLimitMinutes: number;
        createdBy: number;
        passScore: number;
        badgeTemplateId: number | null;
    }>;
    static getAllAssessments(page?: number, limit?: number): Promise<{
        assessments: ({
            _count: {
                results: number;
            };
            creator: {
                name: string | null;
                id: number;
            };
        } & {
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            slug: string;
            description: string | null;
            title: string;
            category: string;
            timeLimitMinutes: number;
            createdBy: number;
            passScore: number;
            badgeTemplateId: number | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getAssessmentWithQuestions(assessmentId: number): Promise<({
        questions: {
            id: number;
            options: import("../../generated/prisma/runtime/library").JsonValue;
            question: string;
        }[];
        creator: {
            name: string | null;
            id: number;
        };
    } & {
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        slug: string;
        description: string | null;
        title: string;
        category: string;
        timeLimitMinutes: number;
        createdBy: number;
        passScore: number;
        badgeTemplateId: number | null;
    }) | null>;
    static getAssessmentWithAnswers(assessmentId: number): Promise<({
        questions: {
            id: number;
            options: import("../../generated/prisma/runtime/library").JsonValue;
            question: string;
            answer: string;
            orderIndex: number;
            assessmentId: number;
        }[];
    } & {
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        slug: string;
        description: string | null;
        title: string;
        category: string;
        timeLimitMinutes: number;
        createdBy: number;
        passScore: number;
        badgeTemplateId: number | null;
    }) | null>;
    static updateAssessment(assessmentId: number, createdBy: number, data: any): Promise<import("../../generated/prisma").Prisma.BatchPayload | ({
        questions: {
            id: number;
            options: import("../../generated/prisma/runtime/library").JsonValue;
            question: string;
            answer: string;
            orderIndex: number;
            assessmentId: number;
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
    } & {
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        slug: string;
        description: string | null;
        title: string;
        category: string;
        timeLimitMinutes: number;
        createdBy: number;
        passScore: number;
        badgeTemplateId: number | null;
    }) | null>;
    static deleteAssessment(assessmentId: number, createdBy: number): Promise<{
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        slug: string;
        description: string | null;
        title: string;
        category: string;
        timeLimitMinutes: number;
        createdBy: number;
        passScore: number;
        badgeTemplateId: number | null;
    } | null>;
    static getDeveloperAssessments(createdBy: number): Promise<({
        _count: {
            questions: number;
            results: number;
        };
        badgeTemplate: {
            name: string;
            id: number;
            category: string | null;
            icon: string | null;
        } | null;
    } & {
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        slug: string;
        description: string | null;
        title: string;
        category: string;
        timeLimitMinutes: number;
        createdBy: number;
        passScore: number;
        badgeTemplateId: number | null;
    })[]>;
    static saveAssessmentResult(data: any): Promise<{
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
    }) | null>;
    static getUserResults(userId: number, page?: number, limit?: number): Promise<{
        results: ({
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getAssessmentResults(assessmentId: number, createdBy?: number): Promise<({
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
}
//# sourceMappingURL=skillAssessment.repository.d.ts.map