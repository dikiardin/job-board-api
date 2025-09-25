export interface CVStatistics {
    totalCVs: number;
    totalUsers: number;
    templateStats: {
        templateUsed: string;
        count: number;
    }[];
    monthlyStats: {
        month: string;
        count: number;
    }[];
}
export declare class CVRepositoryAnalytics {
    getStatistics(): Promise<CVStatistics>;
    getTemplateStats(): Promise<{
        templateUsed: string;
        count: number;
    }[]>;
    getMonthlyStats(months?: number): Promise<{
        month: string;
        count: number;
    }[]>;
    getUserEngagementStats(): Promise<{
        activeUsers: number;
        averageCVsPerUser: number;
        topUsers: {
            userId: number;
            cvCount: number;
            userName?: string;
        }[];
    }>;
}
export declare const cvRepositoryAnalytics: CVRepositoryAnalytics;
//# sourceMappingURL=cv.repository.analytics.d.ts.map