import { UserRole } from "../../generated/prisma";
export declare class SkillAssessmentService {
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
    static getAssessmentForUser(assessmentId: number, userId: number): Promise<{
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
    }>;
    static submitAssessment(data: {
        userId: number;
        assessmentId: number;
        startedAt: string;
        answers: Array<{
            questionId: number;
            selectedAnswer: string;
        }>;
    }): Promise<{
        percentage: number;
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
    static getUserResults(userId: number): Promise<{
        results: {
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
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        } | null;
    }>;
    static getDeveloperAssessments(userId: number, userRole: UserRole): Promise<{
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
    }[]>;
    static getAssessmentByIdForDeveloper(assessmentId: number, userId: number, userRole: UserRole): Promise<{
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
    }>;
    static getAssessmentResults(assessmentId: number, userId: number, userRole: UserRole): Promise<({
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
    })[]>;
    static verifyCertificate(certificateCode: string): Promise<{
        isValid: boolean;
        certificate: {
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
        };
        verificationUrl: string;
    }>;
    static updateAssessment(assessmentId: number, userId: number, userRole: UserRole, data: {
        title?: string;
        description?: string;
        badgeTemplateId?: number | null;
        questions?: Array<{
            question: string;
            options: string[];
            answer: string;
        }>;
    }): Promise<{
        message: string;
    }>;
    static saveQuestion(data: {
        assessmentId: number;
        question: string;
        options: string[];
        answer: string;
        userId: number;
        userRole: UserRole;
    }): Promise<{
        id: number;
        options: import("../../generated/prisma/runtime/library").JsonValue;
        question: string;
        answer: string;
        orderIndex: number;
        assessmentId: number;
    }>;
    static deleteAssessment(assessmentId: number, userId: number, userRole: UserRole): Promise<{
        message: string;
    }>;
    static downloadCertificate(resultId: number, userId: number): Promise<{
        certificateUrl: string;
        certificateCode: string | null;
        assessment: {
            id: number;
            title: string;
        };
    }>;
    private static getUserInfo;
    static getAssessmentForTaking(assessmentId: number, userId: number): Promise<{
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
    }>;
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
    static shareCertificate(code: string, platform: string, userId: number): Promise<{
        shareUrl: string;
        platform: string;
        certificateUrl: string;
    }>;
    static getAssessmentLeaderboard(assessmentId: number, limit?: number): Promise<{
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
    }[]>;
    static getAssessmentStats(assessmentId: number): Promise<{
        totalAttempts: number;
        averageScore: number;
        averageTime: number;
        passRate: number;
        highestScore: number;
        lowestScore: number;
    } | {
        totalAttempts: number;
        averageScore: number;
        passRate: number;
        highestScore: number;
        lowestScore: number;
        averageTime?: never;
    }>;
}
//# sourceMappingURL=skillAssessment.service.d.ts.map