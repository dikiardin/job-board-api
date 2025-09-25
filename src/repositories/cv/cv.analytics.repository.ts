import { prisma } from "../../config/prisma";

export interface CVStatistics {
  totalCVs: number;
  totalUsers: number;
  templateStats: { templateUsed: string; count: number }[];
  monthlyStats: { month: string; count: number }[];
}

export class CVAnalyticsRepo {
  // Get CV statistics
  public static async getStatistics(): Promise<CVStatistics> {
    const [totalCVs, userGroups, templateGroups] = await Promise.all([
      prisma.generatedCV.count(),
      prisma.generatedCV.groupBy({
        by: ['userId'],
        _count: { userId: true },
      }),
      prisma.generatedCV.groupBy({
        by: ['templateUsed'],
        _count: { templateUsed: true },
      }),
    ]);

    const templateStats = templateGroups.map(item => ({
      templateUsed: item.templateUsed,
      count: item._count.templateUsed,
    }));

    // Get monthly stats for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await prisma.generatedCV.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    });

    const monthlyStats = Object.entries(
      monthlyData.reduce((acc: { [key: string]: number }, cv) => {
        const month = cv.createdAt.toISOString().substring(0, 7);
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {})
    ).map(([month, count]) => ({ month, count }));

    return {
      totalCVs,
      totalUsers: userGroups.length,
      templateStats,
      monthlyStats,
    };
  }

  // Get template usage statistics
  public static async getTemplateStats(): Promise<{ templateUsed: string; count: number }[]> {
    const templateGroups = await prisma.generatedCV.groupBy({
      by: ['templateUsed'],
      _count: { templateUsed: true },
    });

    return templateGroups.map(item => ({
      templateUsed: item.templateUsed,
      count: item._count.templateUsed,
    }));
  }

  // Get monthly CV generation stats
  public static async getMonthlyStats(months: number = 6): Promise<{ month: string; count: number }[]> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const monthlyData = await prisma.generatedCV.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true },
    });

    const monthlyStats = monthlyData.reduce((acc: { [key: string]: number }, cv) => {
      const month = cv.createdAt.toISOString().substring(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(monthlyStats)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  // Get user engagement statistics
  public static async getUserEngagementStats(): Promise<{
    activeUsers: number;
    averageCVsPerUser: number;
    topUsers: { userId: number; cvCount: number; userName?: string }[];
  }> {
    const userStats = await prisma.generatedCV.groupBy({
      by: ['userId'],
      _count: { userId: true },
      orderBy: { _count: { userId: 'desc' } },
      take: 10,
    });

    const activeUsers = userStats.length;
    const totalCVs = userStats.reduce((sum, user) => sum + user._count.userId, 0);
    const averageCVsPerUser = activeUsers > 0 ? totalCVs / activeUsers : 0;

    // Get user names for top users
    const topUserIds = userStats.slice(0, 5).map(stat => stat.userId);
    const userNames = await prisma.user.findMany({
      where: { id: { in: topUserIds } },
      select: { id: true, name: true },
    });

    const topUsers = userStats.slice(0, 5).map(stat => {
      const user = userNames.find(u => u.id === stat.userId);
      return {
        userId: stat.userId,
        cvCount: stat._count.userId,
        ...(user?.name && { userName: user.name }),
      };
    });

    return {
      activeUsers,
      averageCVsPerUser: Math.round(averageCVsPerUser * 100) / 100,
      topUsers,
    };
  }
}
