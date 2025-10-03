export declare class BadgeService {
    static awardBadgeFromAssessment(userId: number, assessmentId: number, score: number, totalQuestions: number): Promise<{
        id: number;
        userId: number;
        badgeTemplateId: number | null;
        assessmentId: number | null;
        badgeId: number | null;
        earnedAt: Date;
        evidenceUrl: string | null;
        badgeType: string;
    } | null>;
    private static generateBadgeFromTitle;
    static getUserBadges(userId: number): Promise<{
        id: number;
        userId: number;
        badgeTemplateId: number | null;
        assessmentId: number | null;
        badgeId: number | null;
        earnedAt: Date;
        evidenceUrl: string | null;
        badgeType: string;
    }[]>;
    static getBadgeStats(): Promise<{
        badgeName: any;
        count: any;
    }[]>;
    static getTopBadgeHolders(limit?: number): Promise<{
        id: number;
        name: string | null;
        email: string;
        badgeCount: number;
        badges: {
            name: any;
            icon: any;
            awardedAt: any;
        }[];
    }[]>;
    static checkMilestoneBadges(userId: number): Promise<never[]>;
    static getBadgeDetails(badgeId: number): Promise<({
        user: {
            email: string;
            name: string | null;
            id: number;
        };
        badgeTemplate: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
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
        badgeId: number | null;
        earnedAt: Date;
        evidenceUrl: string | null;
        badgeType: string;
    }) | null>;
    static verifyBadge(badgeId: number, userId: number): Promise<{
        isValid: boolean;
        badge: {
            user: {
                email: string;
                name: string | null;
                id: number;
            };
            badgeTemplate: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
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
            badgeId: number | null;
            earnedAt: Date;
            evidenceUrl: string | null;
            badgeType: string;
        };
    }>;
}
//# sourceMappingURL=badge.service.d.ts.map