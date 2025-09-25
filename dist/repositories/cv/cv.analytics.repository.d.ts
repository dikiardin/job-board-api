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
export declare class CVAnalyticsRepo {
    static getStatistics(): Promise<CVStatistics>;
    static getTemplateStats(): Promise<{
        templateUsed: string;
        count: number;
    }[]>;
    static getMonthlyStats(months?: number): Promise<{
        month: string;
        count: number;
    }[]>;
    static getUserEngagementStats(): Promise<{
        activeUsers: number;
        averageCVsPerUser: number;
        topUsers: {
            userId: number;
            cvCount: number;
            userName?: string;
        }[];
    }>;
}
//# sourceMappingURL=cv.analytics.repository.d.ts.map