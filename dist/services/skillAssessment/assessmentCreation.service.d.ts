import { UserRole } from "../../generated/prisma";
export declare class AssessmentCreationService {
    static createAssessment(data: {
        title: string;
        description?: string;
        category: string;
        badgeTemplateId?: number;
        passScore?: number;
        createdBy: number;
        userRole: UserRole;
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
    static getAssessments(page?: number, limit?: number): Promise<{
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
    static getAssessmentById(assessmentId: number, userRole: UserRole): Promise<{
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
    }>;
    static getAssessmentBySlug(slug: string, userRole: UserRole): Promise<{
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
    }>;
    static updateAssessment(assessmentId: number, userId: number, data: {
        title?: string;
        description?: string;
        category?: string;
        badgeTemplateId?: number;
        passScore?: number;
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
    private static validateUpdateQuestions;
    static deleteAssessment(assessmentId: number, userId: number): Promise<{
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
    static getAssessmentStats(assessmentId: number, userRole: UserRole): Promise<{
        totalAssessments: number;
        totalQuestions: number;
        totalResults: number;
    }>;
    private static validateQuestionStructure;
    static importQuestions(assessmentId: number, questions: Array<{
        question: string;
        options: string[];
        answer: string;
    }>, userRole: UserRole): Promise<import("../../generated/prisma").Prisma.BatchPayload | ({
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
    static exportQuestions(assessmentId: number, userRole: UserRole): Promise<{
        assessmentId: number;
        title: string;
        description: string | null;
        questions: any;
        exportedAt: string;
    }>;
    private static validatePassScore;
}
//# sourceMappingURL=assessmentCreation.service.d.ts.map