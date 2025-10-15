export declare class SkillAssessmentResultsStatsRepository {
    static getAssessmentStats(assessmentId: number): Promise<{
        totalAttempts: number;
        averageScore: number;
        passRate: number;
        averageTimeSpent: number;
    }>;
}
//# sourceMappingURL=skillAssessmentResultsStats.repository.d.ts.map