export declare class AssessmentResultsRepository {
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
}
//# sourceMappingURL=assessmentResults.repository.d.ts.map