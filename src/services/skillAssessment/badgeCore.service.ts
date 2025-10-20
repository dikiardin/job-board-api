import { prisma } from "../../config/prisma";
import { CustomError } from "../../utils/customError";

export class BadgeCoreService {
  /**
   * Get all badges earned by user
   */
  public static async getUserBadges(userId: number) {
    const badges = await prisma.userBadge.findMany({
      where: {
        userId,
        badgeTemplateId: { not: null },
      },
      include: {
        badgeTemplate: {
          select: {
            name: true,
            icon: true,
            description: true,
            category: true,
          },
        },
        assessment: {
          select: {
            title: true,
            id: true,
          },
        },
      },
      orderBy: { earnedAt: "desc" },
    });

    // Get scores from skill results
    const badgesWithScores = await Promise.all(
      badges.map(async (badge) => {
        let score = 0;
        if (badge.assessmentId) {
          const result = await prisma.skillResult.findFirst({
            where: {
              userId,
              assessmentId: badge.assessmentId,
              isPassed: true,
            },
            select: { score: true },
            orderBy: { score: "desc" },
          });
          score = result?.score || 0;
        }

        return {
          id: badge.id,
          badgeTemplate: {
            title: badge.badgeTemplate?.name || "",
            description: badge.badgeTemplate?.description || "",
            imageUrl: badge.badgeTemplate?.icon || "",
          },
          earnedAt: badge.earnedAt,
          score,
          assessment: badge.assessment,
        };
      })
    );

    return {
      badges: badgesWithScores,
      totalBadges: badgesWithScores.length,
    };
  }

  /**
   * Get badge details by ID
   */
  public static async getBadgeDetails(badgeId: number) {
    const badge = await prisma.userBadge.findUnique({
      where: { id: badgeId },
      include: {
        badgeTemplate: true,
        assessment: {
          select: {
            title: true,
            id: true,
          },
        },
      },
    });

    if (!badge) {
      throw new CustomError("Badge not found", 404);
    }

    // Get score from skill result
    let score = 0;
    if (badge.assessmentId) {
      const result = await prisma.skillResult.findFirst({
        where: {
          userId: badge.userId,
          assessmentId: badge.assessmentId,
          isPassed: true,
        },
        select: { score: true },
        orderBy: { score: "desc" },
      });
      score = result?.score || 0;
    }

    return {
      id: badge.id,
      badgeTemplate: {
        title: badge.badgeTemplate?.name || "",
        description: badge.badgeTemplate?.description || "",
        imageUrl: badge.badgeTemplate?.icon || "",
      },
      userId: badge.userId,
      earnedAt: badge.earnedAt,
      score,
      assessment: badge.assessment,
    };
  }

  /**
   * Award badge to user
   */
  public static async awardBadge(data: {
    userId: number;
    badgeTemplateId: number;
    assessmentId: number;
    score: number;
  }) {
    const existingBadge = await this.checkExistingBadge(
      data.userId,
      data.badgeTemplateId
    );

    if (existingBadge) {
      throw new CustomError("User already has this badge", 400);
    }

    const newBadge = await prisma.userBadge.create({
      data: {
        userId: data.userId,
        badgeTemplateId: data.badgeTemplateId,
        assessmentId: data.assessmentId,
        earnedAt: new Date(),
        badgeType: "skill",
      },
    });

    return newBadge;
  }

  /**
   * Check if user already has this badge
   */
  private static async checkExistingBadge(
    userId: number,
    badgeTemplateId: number
  ) {
    return await prisma.userBadge.findFirst({
      where: {
        userId,
        badgeTemplateId,
      },
    });
  }

  /**
   * Get user badge statistics
   */
  public static async getUserBadgeStats(userId: number) {
    const badges = await this.getUserBadges(userId);

    const avgScore =
      badges.badges.length > 0
        ? badges.badges.reduce((sum, b) => sum + b.score, 0) /
          badges.badges.length
        : 0;

    return {
      totalBadges: badges.totalBadges,
      averageScore: Math.round(avgScore),
      latestBadge: badges.badges[0] || null,
      badgesByMonth: this.getBadgesByMonth(badges.badges),
    };
  }

  /**
   * Group badges by month
   */
  private static getBadgesByMonth(badges: any[]) {
    const grouped = badges.reduce((acc, badge) => {
      const month = new Date(badge.earnedAt).toISOString().substring(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([month, count]) => ({
      month,
      count,
    }));
  }
}
