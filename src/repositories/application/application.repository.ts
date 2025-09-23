import { prisma } from "../../config/prisma";

export class ApplicationRepository {
  static async createApplication(params: { userId: number; jobId: number; cvFile: string; expectedSalary?: number }) {
    return prisma.application.create({
      data: {
        userId: params.userId,
        jobId: params.jobId,
        cvFile: params.cvFile,
        expectedSalary: params.expectedSalary ?? null,
      },
    });
  }

  static async getPreselectionTestByJob(jobId: number) {
    return prisma.preselectionTest.findUnique({ where: { jobId }, include: { results: true } });
  }

  static async getPreselectionResult(userId: number, testId: number) {
    return prisma.preselectionResult.findUnique({ where: { userId_testId: { userId, testId } } });
  }
}
