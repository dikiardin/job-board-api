export declare class SkillAssessmentCrudRepository {
    static createAssessment(data: {
        title: string;
        description?: string;
        badgeTemplateId?: number;
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
            name: string;
            email: string;
            id: number;
        };
    } & {
        createdAt: Date;
        id: number;
        description: string | null;
        title: string;
        createdBy: number;
        badgeTemplateId: number | null;
    }>;
    static getAllAssessments(page?: number, limit?: number): Promise<{
        assessments: ({
            _count: {
                results: number;
            };
            creator: {
                name: string;
                id: number;
            };
        } & {
            createdAt: Date;
            id: number;
            description: string | null;
            title: string;
            createdBy: number;
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
            name: string;
            id: number;
        };
    } & {
        createdAt: Date;
        id: number;
        description: string | null;
        title: string;
        createdBy: number;
        badgeTemplateId: number | null;
    }) | null>;
    static getAssessmentWithAnswers(assessmentId: number): Promise<({
        questions: {
            id: number;
            options: import("../../generated/prisma/runtime/library").JsonValue;
            question: string;
            answer: string;
            assessmentId: number;
        }[];
    } & {
        createdAt: Date;
        id: number;
        description: string | null;
        title: string;
        createdBy: number;
        badgeTemplateId: number | null;
    }) | null>;
    static updateAssessment(assessmentId: number, createdBy: number, data: {
        title?: string;
        description?: string;
        badgeTemplateId?: number;
        questions?: Array<{
            question: string;
            options: string[];
            answer: string;
        }>;
    }): Promise<import("../../generated/prisma").Prisma.BatchPayload | ({
        questions: {
            id: number;
            options: import("../../generated/prisma/runtime/library").JsonValue;
            question: string;
            answer: string;
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
            name: string;
            id: number;
        };
    } & {
        createdAt: Date;
        id: number;
        description: string | null;
        title: string;
        createdBy: number;
        badgeTemplateId: number | null;
    }) | null>;
    static deleteAssessment(assessmentId: number, createdBy: number): Promise<{
        createdAt: Date;
        id: number;
        description: string | null;
        title: string;
        createdBy: number;
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
        createdAt: Date;
        id: number;
        description: string | null;
        title: string;
        createdBy: number;
        badgeTemplateId: number | null;
    })[]>;
}
//# sourceMappingURL=skillAssessmentCrud.repository.d.ts.map