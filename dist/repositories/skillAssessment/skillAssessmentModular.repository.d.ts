import { AssessmentCrudRepository } from "./assessmentCrud.repository";
import { AssessmentResultsRepository } from "./assessmentResults.repository";
export declare class SkillAssessmentModularRepository {
    static createAssessment(data: any): Promise<{
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
    static getAssessmentById(assessmentId: number): Promise<({
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
    static updateAssessment(assessmentId: number, createdBy: number, data: any): Promise<import("../../generated/prisma").Prisma.BatchPayload | ({
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
    })>;
    static deleteAssessment(assessmentId: number, createdBy: number): Promise<{
        createdAt: Date;
        id: number;
        description: string | null;
        title: string;
        createdBy: number;
        badgeTemplateId: number | null;
    } | null>;
    static getDeveloperAssessments(createdBy: number, page?: number, limit?: number): Promise<{
        createdAt: Date;
        id: number;
        description: string | null;
        title: string;
        createdBy: number;
        badgeTemplateId: number | null;
    }[]>;
    static searchAssessments(searchTerm: string, page?: number, limit?: number): Promise<{
        createdAt: Date;
        id: number;
        description: string | null;
        title: string;
        createdBy: number;
        badgeTemplateId: number | null;
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
            assessmentId: number;
        }[];
        badgeTemplate: {
            name: string;
            id: number;
            icon: string | null;
        } | null;
    } & {
        createdAt: Date;
        id: number;
        description: string | null;
        title: string;
        createdBy: number;
        badgeTemplateId: number | null;
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
        assessmentId: number;
    }>;
    static saveAssessmentResult(data: any): Promise<{
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
    }>;
    static getUserResult(userId: number, assessmentId: number): Promise<({
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
    }) | null>;
    static getAssessmentResults(assessmentId: number): Promise<({
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
    static getUserResults(userId: number, page?: number, limit?: number): Promise<{
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
    static verifyCertificate(certificateCode: string): Promise<({
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
    }) | null>;
    static getUserCertificates(userId: number, page?: number, limit?: number): Promise<{
        certificates: {
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
    static getCertificateByCode(certificateCode: string): Promise<({
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
    }) | null>;
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
    static getAssessmentStatistics(assessmentId: number): Promise<{
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
    static deleteAssessmentResult(resultId: number): Promise<{
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
    static updateCertificateInfo(resultId: number, certificateUrl: string, certificateCode: string): Promise<{
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
    static getUserAssessmentHistory(userId: number): Promise<{
        results: ({
            assessment: {
                id: number;
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
        statistics: {
            totalAssessments: number;
            passedAssessments: number;
            averageScore: number;
            passRate: number;
        };
    }>;
    static getGlobalAssessmentStats(): Promise<{
        totalResults: number;
        totalUsers: number;
        totalAssessments: number;
    }>;
    static getAssessmentWithResults(assessmentId: number): Promise<{
        assessment: ({
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
        }) | null;
        results: ({
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
        })[];
        statistics: {
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
        };
    }>;
    static getUserAssessmentSummary(userId: number): Promise<{
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
        certificates: {
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
        statistics: {
            totalAssessments: number;
            passedAssessments: number;
            averageScore: number;
            passRate: number;
        };
    }>;
    static get CrudRepository(): typeof AssessmentCrudRepository;
    static get ResultsRepository(): typeof AssessmentResultsRepository;
}
export default SkillAssessmentModularRepository;
export { AssessmentCrudRepository, AssessmentResultsRepository };
//# sourceMappingURL=skillAssessmentModular.repository.d.ts.map