import { prisma } from "../../config/prisma";

export class AssessmentResultsMutationRepository {
  // Save assessment result
  public static async saveAssessmentResult(data: {
    userId: number;
    assessmentId: number;
    score: number;
    isPassed: boolean;
    certificateUrl?: string;
    certificateCode?: string;
  }) {
    return await prisma.skillResult.create({
      data: {
        userId: data.userId,
        assessmentId: data.assessmentId,
        score: data.score,
        isPassed: data.isPassed,
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

  // Delete assessment result
  public static async deleteAssessmentResult(resultId: number) {
    return await prisma.skillResult.delete({
      where: { id: resultId },
    });
  }

  // Update certificate info
  public static async updateCertificateInfo(
    resultId: number,
    certificateUrl: string,
    certificateCode: string
  ) {
    return await prisma.skillResult.update({
      where: { id: resultId },
      data: { certificateUrl, certificateCode },
    });
  }
}
