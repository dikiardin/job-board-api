export declare class AssessmentResultsStatsRepository {
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
    static getGlobalAssessmentStats(): Promise<{
        totalResults: number;
        totalUsers: number;
        totalAssessments: number;
    }>;
}
//# sourceMappingURL=assessmentResultsStats.repository.d.ts.map