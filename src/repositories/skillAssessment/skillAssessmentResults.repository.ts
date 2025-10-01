import { prisma } from "../../config/prisma";

export class SkillAssessmentResultsRepository {
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
        user: {
          select: { id: true, name: true, email: true },
        },
        assessment: {
          select: { id: true, title: true, description: true },
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
          select: { id: true, title: true, description: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Get user's all assessment results
  public static async getUserResults(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [results, total] = await Promise.all([
      prisma.skillResult.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          assessment: {
            select: { id: true, title: true, description: true },
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
  public static async getAssessmentResults(assessmentId: number, createdBy: number) {
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

  // Verify certificate by code
  public static async verifyCertificate(certificateCode: string) {
    return await prisma.skillResult.findFirst({
      where: { certificateCode },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        assessment: {
          select: { id: true, title: true, description: true },
        },
      },
    });
  }

  // Get user's certificates
  public static async getUserCertificates(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [certificates, total] = await Promise.all([
      prisma.skillResult.findMany({
        where: { 
          userId,
          certificateCode: { not: null },
        },
        skip,
        take: limit,
        include: {
          assessment: {
            select: { id: true, title: true, description: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.skillResult.count({
        where: { 
          userId,
          certificateCode: { not: null },
        },
      }),
    ]);

    return {
      certificates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get assessment leaderboard
  public static async getAssessmentLeaderboard(assessmentId: number, limit: number = 10) {
    return await prisma.skillResult.findMany({
      where: { assessmentId },
      take: limit,
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: [
        { score: "desc" },
        { createdAt: "asc" },
      ],
    });
  }

  // Get assessment statistics
  public static async getAssessmentStats(assessmentId: number) {
    const results = await prisma.skillResult.findMany({
      where: { assessmentId },
      select: { score: true, startedAt: true, finishedAt: true },
    });

    if (results.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        passRate: 0,
        averageTimeSpent: 0,
      };
    }

    const totalAttempts = results.length;
    const passedAttempts = results.filter(r => r.score >= 75).length;
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    
    // Calculate time spent from startedAt and finishedAt
    const totalTime = results.reduce((sum, r) => {
      if (r.startedAt && r.finishedAt) {
        const timeSpent = Math.round((r.finishedAt.getTime() - r.startedAt.getTime()) / 1000 / 60); // in minutes
        return sum + timeSpent;
      }
      return sum + 30; // default 30 minutes if no time data
    }, 0);

    return {
      totalAttempts,
      averageScore: Math.round(totalScore / totalAttempts),
      passRate: Math.round((passedAttempts / totalAttempts) * 100),
      averageTimeSpent: Math.round(totalTime / totalAttempts),
    };
  }

  // Update certificate info
  public static async updateCertificateInfo(
    resultId: number,
    certificateUrl: string,
    certificateCode: string
  ) {
    return await prisma.skillResult.update({
      where: { id: resultId },
      data: {
        certificateUrl,
        certificateCode,
      },
    });
  }

  // Get certificate by code
  public static async getCertificateByCode(certificateCode: string) {
    return await prisma.skillResult.findFirst({
      where: { certificateCode },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        assessment: {
          select: { id: true, title: true, description: true },
        },
      },
    });
  }
}
