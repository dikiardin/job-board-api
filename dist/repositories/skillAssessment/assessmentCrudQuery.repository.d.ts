export declare class AssessmentCrudQueryRepository {
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
}
//# sourceMappingURL=assessmentCrudQuery.repository.d.ts.map