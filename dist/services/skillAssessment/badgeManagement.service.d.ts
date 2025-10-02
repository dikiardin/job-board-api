import { UserRole } from "../../generated/prisma";
export declare class BadgeManagementService {
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
    static verifyBadge(badgeId: number, userId: number): Promise<{
        isValid: boolean;
        badge: {
            id: number;
            title: string;
            description: string;
            imageUrl: string;
            earnedAt: Date;
            assessmentTitle: string;
            score: number;
        };
    }>;
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
    static getBadgeRequirements(badgeTemplateId: number): Promise<{
        badgeTemplate: {
            title: string;
            description: string;
            imageUrl: string;
        };
        requirements: {
            minimumScore: number;
            assessmentTitle: string;
            prerequisiteBadges: never[];
            validityPeriod: string;
        };
        benefits: string[];
    }>;
    static revokeBadge(badgeId: number, reason: string, userRole: UserRole): Promise<{
        success: boolean;
        message: string;
        badgeId: number;
        reason: string;
        revokedAt: Date;
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
    static shareBadge(badgeId: number, platform: string, userId: number): Promise<{
        shareUrl: string;
        platform: string;
        badgeUrl: string;
    }>;
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
//# sourceMappingURL=badgeManagement.service.d.ts.map