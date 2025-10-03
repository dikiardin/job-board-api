import { CustomError } from "../../utils/customError";
import { UserRole } from "../../generated/prisma";
import { BadgeCoreService } from "./badgeCore.service";

export class BadgeVerificationService {
  public static async verifyBadge(badgeId: number, userId: number) {
    const badge = await BadgeCoreService.getBadgeDetails(badgeId);
    if (!badge) {
      throw new CustomError("Badge not found", 404);
    }

    if (badge.userId !== userId) {
      throw new CustomError("Badge does not belong to this user", 403);
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

  public static async getBadgeRequirements(badgeTemplateId: number) {
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

  public static async revokeBadge(badgeId: number, reason: string, userRole: UserRole) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can revoke badges", 403);
    }

    return {
      success: true,
      message: "Badge revoked successfully",
      badgeId,
      reason,
      revokedAt: new Date(),
    };
  }

  public static async shareBadge(badgeId: number, platform: string, userId: number) {
    const badge = await BadgeCoreService.getBadgeDetails(badgeId);
    
    if (badge.userId !== userId) {
      throw new CustomError("You can only share your own badges", 403);
    }

    const shareUrl = `${process.env.FRONTEND_URL}/badges/${badgeId}`;
    const shareText = `I just earned the "${badge.badgeTemplate.title}" badge! 🏆`;

    const shareLinks = BadgeVerificationService.generateShareLinks(shareUrl, shareText);

    if (!shareLinks[platform as keyof typeof shareLinks]) {
      throw new CustomError("Unsupported social media platform", 400);
    }

    return {
      shareUrl: shareLinks[platform as keyof typeof shareLinks],
      platform,
      badgeUrl: shareUrl,
    };
  }

  private static generateShareLinks(shareUrl: string, shareText: string) {
    return {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    };
  }
}
