import { prisma } from "../../config/prisma";

export class AssessmentResultsRepository {
  // Save assessment result
  public static async saveAssessmentResult(data: {
    userId: number;
    assessmentId: number;
    score: number;
    certificateUrl?: string;
    certificateCode?: string;
  }) {
    return await prisma.skillResult.create({
      data: {
        userId: data.userId,
        assessmentId: data.assessmentId,
        score: data.score,
        isPassed: data.score >= 75,
        certificateUrl: data.certificateUrl || null,
        certificateCode: data.certificateCode || null,
        startedAt: new Date(),
        finishedAt: new Date(),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        assessment: { select: { id: true, title: true, description: true } },
      },
    });
  }

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
  public static async getUserResults(userId: number, page?: number, limit?: number) {
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
                category: true 
              } 
            }
          } 
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
      pagination: page && limit ? { page, limit, total, totalPages: Math.ceil(total / limit) } : null,
    };
  }

  // Verify certificate by code
  public static async verifyCertificate(certificateCode: string) {
    return await prisma.skillResult.findFirst({
      where: { certificateCode },
      include: {
        user: { select: { id: true, name: true, email: true } },
        assessment: { select: { id: true, title: true, description: true } },
      },
    });
  }

  // Get user's certificates
  public static async getUserCertificates(userId: number, page?: number, limit?: number) {
    const query: any = {
      where: { userId, certificateCode: { not: null } },
      include: {
        assessment: { select: { id: true, title: true, description: true } },
      },
      orderBy: { createdAt: "desc" },
    };

    if (page && limit) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    const [certificates, total] = await Promise.all([
      prisma.skillResult.findMany(query),
      prisma.skillResult.count({ where: { userId, certificateCode: { not: null } } }),
    ]);

    return {
      certificates,
      pagination: page && limit ? { page, limit, total, totalPages: Math.ceil(total / limit) } : null,
    };
  }

  // Get certificate by code
  public static async getCertificateByCode(certificateCode: string) {
    return await prisma.skillResult.findFirst({
      where: { certificateCode },
      include: {
        user: { select: { id: true, name: true, email: true } },
        assessment: { select: { id: true, title: true, description: true } },
      },
    });
  }

  // Get assessment leaderboard
  public static async getAssessmentLeaderboard(assessmentId: number, limit?: number) {
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

  // Get assessment statistics
  public static async getAssessmentStatistics(assessmentId: number) {
    const results = await prisma.skillResult.findMany({
      where: { assessmentId },
      select: { score: true, createdAt: true },
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

    const scores = results.map(r => r.score);
    const passedCount = scores.filter(s => s >= 75).length;

    return {
      totalAttempts: results.length,
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      passRate: Math.round((passedCount / results.length) * 100),
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
    };
  }

  // Delete assessment result
  public static async deleteAssessmentResult(resultId: number) {
    return await prisma.skillResult.delete({
      where: { id: resultId },
    });
  }

  // Update certificate info
  public static async updateCertificateInfo(resultId: number, certificateUrl: string, certificateCode: string) {
    return await prisma.skillResult.update({
      where: { id: resultId },
      data: { certificateUrl, certificateCode },
    });
  }

  // Get user assessment history
  public static async getUserAssessmentHistory(userId: number) {
    const results = await prisma.skillResult.findMany({
      where: { userId },
      include: {
        assessment: { select: { id: true, title: true } },
      },
    });

    const passedCount = results.filter(r => r.score >= 75).length;
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);

    return {
      results,
      statistics: {
        totalAssessments: results.length,
        passedAssessments: passedCount,
        averageScore: results.length > 0 ? Math.round(totalScore / results.length) : 0,
        passRate: results.length > 0 ? Math.round((passedCount / results.length) * 100) : 0,
      },
    };
  }

  // Get global assessment statistics
  public static async getGlobalAssessmentStats() {
    const [totalResults, totalUsers, totalAssessments] = await Promise.all([
      prisma.skillResult.count(),
      prisma.skillResult.groupBy({ by: ['userId'] }),
      prisma.skillAssessment.count(),
    ]);

    return {
      totalResults,
      totalUsers: totalUsers.length,
      totalAssessments,
    };
  }
}
