export declare class AssessmentCrudRepository {
    static createAssessment(data: {
        title: string;
        description?: string;
        category: string;
        badgeTemplateId?: number;
        passScore?: number;
        createdBy: number;
        questions: Array<{
            question: string;
            options: string[];
            answer: string;
        }>;
    }): Promise<{
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
            email: string;
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
        badgeTemplateId: number | null;
        passScore: number;
    }>;
    static getAllAssessments(page?: number, limit?: number): Promise<{
        assessments: ({
            _count: {
                questions: number;
                results: number;
            };
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
            badgeTemplateId: number | null;
            passScore: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getAssessmentById(assessmentId: number): Promise<({
        _count: {
            questions: number;
            results: number;
        };
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
        badgeTemplateId: number | null;
        passScore: number;
    }) | null>;
    static getAssessmentBySlug(slug: string): Promise<({
        _count: {
            questions: number;
            results: number;
        };
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
        badgeTemplateId: number | null;
        passScore: number;
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
        badgeTemplateId: number | null;
        passScore: number;
    })>;
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
        badgeTemplateId: number | null;
        passScore: number;
    } | null>;
    static getDeveloperAssessments(createdBy: number, page?: number, limit?: number): Promise<{
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
        badgeTemplateId: number | null;
        passScore: number;
    }[]>;
    static searchAssessments(searchTerm: string, page?: number, limit?: number): Promise<{
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
        badgeTemplateId: number | null;
        passScore: number;
    }[]>;
    static isAssessmentTitleAvailable(title: string, excludeId?: number): Promise<boolean>;
    static getAssessmentStats(): Promise<{
        totalAssessments: number;
        totalQuestions: number;
        totalResults: number;
    }>;
    static getAssessmentByIdForDeveloper(assessmentId: number, createdBy: number): Promise<({
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
        badgeTemplateId: number | null;
        passScore: number;
    }) | null>;
    static saveQuestion(data: {
        assessmentId: number;
        question: string;
        options: string[];
        answer: string;
    }): Promise<{
        id: number;
        options: import("../../generated/prisma/runtime/library").JsonValue;
        question: string;
        answer: string;
        orderIndex: number;
        assessmentId: number;
    }>;
}
//# sourceMappingURL=assessmentCrud.repository.d.ts.map