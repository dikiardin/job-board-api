import { prisma } from "../../config/prisma";

export class AssessmentCrudStatsRepository {
  // Get assessment statistics
  public static async getAssessmentStats() {
    const [totalAssessments, totalQuestions, totalResults] = await Promise.all([
      prisma.skillAssessment.count(),
      prisma.skillQuestion.count(),
      prisma.skillResult.count(),
    ]);

    return { totalAssessments, totalQuestions, totalResults };
  }
}
