"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeVerificationService = void 0;
const customError_1 = require("../../utils/customError");
const prisma_1 = require("../../generated/prisma");
const badgeCore_service_1 = require("./badgeCore.service");
class BadgeVerificationService {
    static async verifyBadge(badgeId, userId) {
        const badge = await badgeCore_service_1.BadgeCoreService.getBadgeDetails(badgeId);
        if (!badge) {
            throw new customError_1.CustomError("Badge not found", 404);
        }
        if (badge.userId !== userId) {
            throw new customError_1.CustomError("Badge does not belong to this user", 403);
        }
        return {
            isValid: true,
            badge: {
                id: badge.id,
                title: badge.badgeTemplate.title,
                description: badge.badgeTemplate.description,
                imageUrl: badge.badgeTemplate.imageUrl,
                earnedAt: badge.earnedAt,
                assessmentTitle: badge.assessment?.title,
                score: badge.score,
            },
        };
    }
    static async getBadgeRequirements(badgeTemplateId) {
        return {
            badgeTemplate: {
                title: "JavaScript Expert",
                description: "Mastered JavaScript fundamentals",
                imageUrl: "/badges/javascript.png",
            },
            requirements: {
                minimumScore: 75,
                assessmentTitle: "JavaScript Assessment",
                prerequisiteBadges: [],
                validityPeriod: "2 years",
            },
            benefits: [
                "Showcase JavaScript expertise on profile",
                "Access to advanced JavaScript resources",
                "Priority consideration for JavaScript roles",
            ],
        };
    }
    static async revokeBadge(badgeId, reason, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can revoke badges", 403);
        }
        return {
            success: true,
            message: "Badge revoked successfully",
            badgeId,
            reason,
            revokedAt: new Date(),
        };
    }
    static async shareBadge(badgeId, platform, userId) {
        const badge = await badgeCore_service_1.BadgeCoreService.getBadgeDetails(badgeId);
        if (badge.userId !== userId) {
            throw new customError_1.CustomError("You can only share your own badges", 403);
        }
        const shareUrl = `${process.env.FRONTEND_URL}/badges/${badgeId}`;
        const shareText = `I just earned the "${badge.badgeTemplate.title}" badge! 🏆`;
        const shareLinks = BadgeVerificationService.generateShareLinks(shareUrl, shareText);
        if (!shareLinks[platform]) {
            throw new customError_1.CustomError("Unsupported social media platform", 400);
        }
        return {
            shareUrl: shareLinks[platform],
            platform,
            badgeUrl: shareUrl,
        };
    }
    static generateShareLinks(shareUrl, shareText) {
        return {
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
        };
    }
}
exports.BadgeVerificationService = BadgeVerificationService;
//# sourceMappingURL=badgeVerification.service.js.map