import { prisma } from "../../config/prisma";

export class BadgeTemplateStatsRepository {
  // Get badge template statistics
  public static async getBadgeTemplateStats() {
    const [total, totalAwarded, totalAssessments] = await Promise.all([
      prisma.badgeTemplate.count(),
      prisma.userBadge.count(),
      prisma.skillAssessment.count({
        where: { badgeTemplateId: { not: null } },
      }),
    ]);

    return {
      totalTemplates: total,
      totalBadgesAwarded: totalAwarded,
      totalAssessmentsWithBadges: totalAssessments,
    };
  }
}
