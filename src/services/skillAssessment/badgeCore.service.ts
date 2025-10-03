import { CustomError } from "../../utils/customError";

export class BadgeCoreService {
  public static async getUserBadges(userId: number) {
    return {
      badges: [{
        id: 1,
        badgeTemplate: {
          title: "JavaScript Expert",
          description: "Mastered JavaScript fundamentals",
          imageUrl: "/badges/javascript.png",
        },
        earnedAt: new Date(),
        score: 95,
      }],
      totalBadges: 1,
    };
  }

  public static async getBadgeDetails(badgeId: number) {
    return {
      id: badgeId,
      badgeTemplate: {
        title: "JavaScript Expert",
        description: "Mastered JavaScript fundamentals",
        imageUrl: "/badges/javascript.png",
      },
      userId: 1,
      earnedAt: new Date(),
      score: 95,
      assessment: {
        title: "JavaScript Assessment",
      },
    };
  }

  public static async awardBadge(data: {
    userId: number;
    badgeTemplateId: number;
    assessmentId: number;
    score: number;
  }) {
    const existingBadge = await BadgeCoreService.checkExistingBadge(data.userId, data.badgeTemplateId);
    if (existingBadge) {
      throw new CustomError("User already has this badge", 400);
    }

    return {
      id: Date.now(),
      userId: data.userId,
      badgeTemplateId: data.badgeTemplateId,
      assessmentId: data.assessmentId,
      score: data.score,
      earnedAt: new Date(),
    };
  }

  private static async checkExistingBadge(userId: number, badgeTemplateId: number) {
    return null; // Mock check - would typically query database
  }

  public static async getUserBadgeStats(userId: number) {
    const badges = await BadgeCoreService.getUserBadges(userId);
    
    return {
      totalBadges: badges.totalBadges,
      averageScore: badges.badges.reduce((sum, badge) => sum + badge.score, 0) / badges.badges.length || 0,
      latestBadge: badges.badges[0] || null,
      badgesByMonth: BadgeCoreService.getBadgesByMonth(badges.badges),
    };
  }

  private static getBadgesByMonth(badges: any[]) {
    const grouped = badges.reduce((acc, badge) => {
      const month = badge.earnedAt.toISOString().substring(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([month, count]) => ({ month, count }));
  }
}
