import { UserRole } from "../../generated/prisma";
export declare class AssessmentCreationService {
    static createAssessment(data: {
        title: string;
        description?: string;
        badgeTemplateId?: number;
        createdBy: number;
        userRole: UserRole;
        questions: Array<{
            question: string;
            options: string[];
            answer: string;
        }>;
    }): Promise<{
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
    static getAssessmentById(assessmentId: number, userRole: UserRole): Promise<{
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
        passScore: number;
        badgeTemplateId: number | null;
    }>;
    static updateAssessment(assessmentId: number, userId: number, data: {
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
    })>;
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
        passScore: number;
        badgeTemplateId: number | null;
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
        passScore: number;
        badgeTemplateId: number | null;
    })>;
    static exportQuestions(assessmentId: number, userRole: UserRole): Promise<{
        assessmentId: number;
        title: string;
        description: string | null;
        questions: any;
        exportedAt: string;
    }>;
}
//# sourceMappingURL=assessmentCreation.service.d.ts.map