import { UserRole } from "../../generated/prisma";
export declare class BadgeVerificationService {
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
    static shareBadge(badgeId: number, platform: string, userId: number): Promise<{
        shareUrl: string;
        platform: string;
        badgeUrl: string;
    }>;
    private static generateShareLinks;
}
//# sourceMappingURL=badgeVerification.service.d.ts.map