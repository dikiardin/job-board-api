import { prisma } from "../../config/prisma";

export class SkillAssessmentResultsQueryRepository {
  // Get result by slug
  public static async getResultBySlug(slug: string) {
    return await prisma.skillResult.findUnique({
      where: { slug },
      include: {
        user: { select: { id: true, name: true, email: true } },
        assessment: {
          select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            passScore: true,
            creator: { select: { id: true, name: true } },
            badgeTemplate: {
              select: { id: true, name: true, icon: true, category: true },
            },
          },
        },
      },
    });
  }
  // Get user's assessment result for specific assessment
  public static async getUserResult(userId: number, assessmentId: number) {
    return await prisma.skillResult.findFirst({
      where: { userId, assessmentId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        assessment: {
          select: { id: true, title: true, description: true, passScore: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Get user's all assessment results
  public static async getUserResults(
    userId: number,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      prisma.skillResult.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          assessment: {
            select: {
              id: true,
              title: true,
              description: true,
              passScore: true,
              creator: {
                select: { id: true, name: true },
              },
              badgeTemplate: {
                select: { id: true, name: true, icon: true, category: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.skillResult.count({ where: { userId } }),
    ]);

    return {
      results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get assessment results for developer
  public static async getAssessmentResults(
    assessmentId: number,
    createdBy: number
  ) {
    const assessment = await prisma.skillAssessment.findFirst({
      where: { id: assessmentId, createdBy },
    });

    if (!assessment) return null;

    return await prisma.skillResult.findMany({
      where: { assessmentId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { score: "desc" },
    });
  }

  // Get assessment leaderboard
  public static async getAssessmentLeaderboard(
    assessmentId: number,
    limit: number = 10
  ) {
    return await prisma.skillResult.findMany({
      where: { assessmentId },
      take: limit,
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: [{ score: "desc" }, { createdAt: "asc" }],
    });
  }

  // Get user assessment attempts for a specific assessment
  public static async getUserAssessmentAttempts(
    userId: number,
    assessmentId: number
  ) {
    return await prisma.skillResult.findMany({
      where: {
        userId,
        assessmentId,
      },
      select: {
        id: true,
        assessmentId: true,
        userId: true,
        createdAt: true,
        score: true,
        isPassed: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
