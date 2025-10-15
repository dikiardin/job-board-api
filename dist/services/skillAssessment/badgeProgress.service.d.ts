import { UserRole } from "../../generated/prisma";
export declare class BadgeProgressService {
    static getBadgeAnalytics(userRole: UserRole): Promise<{
        totalBadgesAwarded: number;
        badgesThisMonth: number;
        topBadges: {
            title: string;
            awarded: number;
        }[];
        badgesByCategory: {
            programming: number;
            frameworks: number;
            databases: number;
        };
    }>;
    static getBadgeLeaderboard(badgeTemplateId: number, limit?: number): Promise<{
        leaderboard: {
            userId: number;
            userName: string;
            score: number;
            earnedAt: Date;
        }[];
        badgeTemplate: {
            title: string;
            description: string;
        };
    }>;
    static getUserBadgeProgress(userId: number): Promise<{
        earnedBadges: number;
        availableBadges: number;
        progressPercentage: number;
        nextBadges: {
            badgeTemplate: {
                title: string;
                description: string;
                imageUrl: string;
            };
            requirements: {
                assessmentTitle: string;
                minimumScore: number;
            };
            progress: number;
        }[];
    }>;
}
//# sourceMappingURL=badgeProgress.service.d.ts.map