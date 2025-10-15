export declare class AssessmentCrudMutationRepository {
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
//# sourceMappingURL=assessmentCrudMutation.repository.d.ts.map