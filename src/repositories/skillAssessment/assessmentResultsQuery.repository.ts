import { prisma } from "../../config/prisma";

export class AssessmentResultsQueryRepository {
  // Get user's result for specific assessment
  public static async getUserResult(userId: number, assessmentId: number) {
    return await prisma.skillResult.findFirst({
      where: { userId, assessmentId },
      include: {
        assessment: { select: { id: true, title: true, description: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Get all results for an assessment
  public static async getAssessmentResults(assessmentId: number) {
    return await prisma.skillResult.findMany({
      where: { assessmentId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { score: "desc" },
    });
  }

  // Get user's all results with pagination
  public static async getUserResults(
    userId: number,
    page?: number,
    limit?: number
  ) {
    const query: any = {
      where: { userId },
      include: {
        assessment: {
          select: {
            id: true,
            title: true,
            description: true,
            creator: { select: { id: true, name: true } },
            badgeTemplate: {
              select: {
                id: true,
                name: true,
                icon: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    };

    if (page && limit) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    const [results, total] = await Promise.all([
      prisma.skillResult.findMany(query),
      prisma.skillResult.count({ where: { userId } }),
    ]);

    return {
      results,
      pagination:
        page && limit
          ? { page, limit, total, totalPages: Math.ceil(total / limit) }
          : null,
    };
  }

  // Get assessment leaderboard
  public static async getAssessmentLeaderboard(
    assessmentId: number,
    limit?: number
  ) {
    const query: any = {
      where: { assessmentId },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: [{ score: "desc" }, { createdAt: "asc" }],
    };

    if (limit) query.take = limit;

    return await prisma.skillResult.findMany(query);
  }

  // Get user assessment history
  public static async getUserAssessmentHistory(userId: number) {
    const results = await prisma.skillResult.findMany({
      where: { userId },
      include: {
        assessment: { select: { id: true, title: true } },
      },
    });

    const passedCount = results.filter((r) => r.isPassed).length;
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);

    return {
      results,
      statistics: {
        totalAssessments: results.length,
        passedAssessments: passedCount,
        averageScore:
          results.length > 0 ? Math.round(totalScore / results.length) : 0,
        passRate:
          results.length > 0
            ? Math.round((passedCount / results.length) * 100)
            : 0,
      },
    };
  }
}
