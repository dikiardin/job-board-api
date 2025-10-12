import { prisma } from "../../config/prisma";

export class AssessmentResultsStatsRepository {
  // Get assessment statistics
  public static async getAssessmentStatistics(assessmentId: number) {
    const results = await prisma.skillResult.findMany({
      where: { assessmentId },
      select: { score: true, isPassed: true, createdAt: true },
    });

    if (results.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        averageTime: 0,
        passRate: 0,
        highestScore: 0,
        lowestScore: 0,
      };
    }

    const scores = results.map((r) => r.score);
    const passedCount = results.filter((r) => r.isPassed).length;

    return {
      totalAttempts: results.length,
      averageScore: Math.round(
        scores.reduce((a, b) => a + b, 0) / scores.length
      ),
      passRate: Math.round((passedCount / results.length) * 100),
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
    };
  }

  // Get global assessment statistics
  public static async getGlobalAssessmentStats() {
    const [totalResults, totalUsers, totalAssessments] = await Promise.all([
      prisma.skillResult.count(),
      prisma.skillResult.groupBy({ by: ["userId"] }),
      prisma.skillAssessment.count(),
    ]);

    return {
      totalResults,
      totalUsers: totalUsers.length,
      totalAssessments,
    };
  }
}
