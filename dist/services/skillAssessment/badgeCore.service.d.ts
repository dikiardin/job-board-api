export declare class BadgeCoreService {
    static getUserBadges(userId: number): Promise<{
        badges: {
            id: number;
            badgeTemplate: {
                title: string;
                description: string;
                imageUrl: string;
            };
            earnedAt: Date;
            score: number;
        }[];
        totalBadges: number;
    }>;
    static getBadgeDetails(badgeId: number): Promise<{
        id: number;
        badgeTemplate: {
            title: string;
            description: string;
            imageUrl: string;
        };
        userId: number;
        earnedAt: Date;
        score: number;
        assessment: {
            title: string;
        };
    }>;
    static awardBadge(data: {
        userId: number;
        badgeTemplateId: number;
        assessmentId: number;
        score: number;
    }): Promise<{
        id: number;
        userId: number;
        badgeTemplateId: number;
        assessmentId: number;
        score: number;
        earnedAt: Date;
    }>;
    private static checkExistingBadge;
    static getUserBadgeStats(userId: number): Promise<{
        totalBadges: number;
        averageScore: number;
        latestBadge: {
            id: number;
            badgeTemplate: {
                title: string;
                description: string;
                imageUrl: string;
            };
            earnedAt: Date;
            score: number;
        } | null;
        badgesByMonth: {
            month: string;
            count: unknown;
        }[];
    }>;
    private static getBadgesByMonth;
}
//# sourceMappingURL=badgeCore.service.d.ts.map