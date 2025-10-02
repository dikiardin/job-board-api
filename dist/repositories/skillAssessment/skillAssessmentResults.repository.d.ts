export declare class SkillAssessmentResultsRepository {
    static saveAssessmentResult(data: {
        userId: number;
        assessmentId: number;
        score: number;
        certificateUrl?: string;
        certificateCode?: string;
    }): Promise<{
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
    static getUserResults(userId: number, page?: number, limit?: number): Promise<{
        results: ({
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
    static getAssessmentResults(assessmentId: number, createdBy: number): Promise<({
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
    })[] | null>;
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
    static getAssessmentLeaderboard(assessmentId: number, limit?: number): Promise<({
        user: {
            name: string;
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
    static getAssessmentStats(assessmentId: number): Promise<{
        totalAttempts: number;
        averageScore: number;
        passRate: number;
        averageTimeSpent: number;
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
}
//# sourceMappingURL=skillAssessmentResults.repository.d.ts.map