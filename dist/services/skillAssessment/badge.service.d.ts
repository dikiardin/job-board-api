export declare class BadgeService {
    static awardBadgeFromAssessment(userId: number, assessmentId: number, score: number, totalQuestions: number): Promise<{
        id: number;
        userId: number;
        badgeTemplateId: number | null;
        assessmentId: number | null;
        badgeName: string;
        badgeIcon: string | null;
        awardedAt: Date;
        badgeType: string;
    } | null>;
    private static generateBadgeFromTitle;
    static getUserBadges(userId: number): Promise<{
        id: number;
        userId: number;
        badgeTemplateId: number | null;
        assessmentId: number | null;
        badgeName: string;
        badgeIcon: string | null;
        awardedAt: Date;
        badgeType: string;
    }[]>;
    static getBadgeStats(): Promise<{
        badgeName: string;
        count: number;
    }[]>;
    static getTopBadgeHolders(limit?: number): Promise<{
        id: number;
        name: string;
        email: string;
        badgeCount: number;
        badges: {
            name: string;
            icon: string | null;
            awardedAt: Date;
        }[];
    }[]>;
    static checkMilestoneBadges(userId: number): Promise<never[]>;
    static getBadgeDetails(badgeId: number): Promise<({
        user: {
            name: string;
            email: string;
            id: number;
        };
        badgeTemplate: {
            name: string;
            createdAt: Date;
            id: number;
            description: string | null;
            category: string | null;
            createdBy: number;
            icon: string | null;
        } | null;
        assessment: {
            id: number;
            title: string;
        } | null;
    } & {
        id: number;
        userId: number;
        badgeTemplateId: number | null;
        assessmentId: number | null;
        badgeName: string;
        badgeIcon: string | null;
        awardedAt: Date;
        badgeType: string;
    }) | null>;
    static verifyBadge(badgeId: number, userId: number): Promise<{
        isValid: boolean;
        badge: {
            user: {
                name: string;
                email: string;
                id: number;
            };
            badgeTemplate: {
                name: string;
                createdAt: Date;
                id: number;
                description: string | null;
                category: string | null;
                createdBy: number;
                icon: string | null;
            } | null;
            assessment: {
                id: number;
                title: string;
            } | null;
        } & {
            id: number;
            userId: number;
            badgeTemplateId: number | null;
            assessmentId: number | null;
            badgeName: string;
            badgeIcon: string | null;
            awardedAt: Date;
            badgeType: string;
        };
    }>;
}
//# sourceMappingURL=badge.service.d.ts.map