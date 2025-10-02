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
    static getAssessments(page?: number, limit?: number): Promise<{
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
    static getAssessmentForUser(assessmentId: number, userId: number): Promise<{
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
    }>;
    static submitAssessment(data: {
        userId: number;
        assessmentId: number;
        answers: Array<{
            questionId: number;
            selectedAnswer: string;
        }>;
    }): Promise<{
        percentage: number;
        user: {
            name: string;
            email: string;
            id: number;
        };
        assessment: {
            id: number;
            description: string | null;
            title: string;
        };
        createdAt: Date;
        id: number;
        userId: number;
        score: number;
        assessmentId: number;
        isPassed: boolean;
        certificateUrl: string | null;
        certificateCode: string | null;
        startedAt: Date | null;
        finishedAt: Date | null;
    }>;
    static getUserResults(userId: number): Promise<{
        results: {
            createdAt: Date;
            id: number;
            userId: number;
            score: number;
            assessmentId: number;
            isPassed: boolean;
            certificateUrl: string | null;
            certificateCode: string | null;
            startedAt: Date | null;
            finishedAt: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        } | null;
    }>;
    static getDeveloperAssessments(userId: number, userRole: UserRole): Promise<{
        createdAt: Date;
        id: number;
        description: string | null;
        title: string;
        createdBy: number;
        badgeTemplateId: number | null;
    }[]>;
    static getAssessmentByIdForDeveloper(assessmentId: number, userId: number, userRole: UserRole): Promise<{
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
    }>;
    static getAssessmentResults(assessmentId: number, userId: number, userRole: UserRole): Promise<({
        user: {
            name: string;
            email: string;
            id: number;
        };
    } & {
        createdAt: Date;
        id: number;
        userId: number;
        score: number;
        assessmentId: number;
        isPassed: boolean;
        certificateUrl: string | null;
        certificateCode: string | null;
        startedAt: Date | null;
        finishedAt: Date | null;
    })[]>;
    static verifyCertificate(certificateCode: string): Promise<{
        isValid: boolean;
        certificate: {
            user: {
                name: string;
                email: string;
                id: number;
            };
            assessment: {
                id: number;
                description: string | null;
                title: string;
            };
        } & {
            createdAt: Date;
            id: number;
            userId: number;
            score: number;
            assessmentId: number;
            isPassed: boolean;
            certificateUrl: string | null;
            certificateCode: string | null;
            startedAt: Date | null;
            finishedAt: Date | null;
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
            id: number;
            userId: number;
            score: number;
            assessmentId: number;
            isPassed: boolean;
            certificateUrl: string | null;
            certificateCode: string | null;
            startedAt: Date | null;
            finishedAt: Date | null;
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
        id: number;
        userId: number;
        score: number;
        assessmentId: number;
        isPassed: boolean;
        certificateUrl: string | null;
        certificateCode: string | null;
        startedAt: Date | null;
        finishedAt: Date | null;
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