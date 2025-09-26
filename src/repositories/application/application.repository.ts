import { prisma } from "../../config/prisma";

export class ApplicationRepo {
  public static async createApplication(data: {
    userId: number;
    jobId: number;
    cvFile: string;
    expectedSalary?: number;
  }) {
    return prisma.application.create({
      data: {
        userId: data.userId,
        jobId: data.jobId,
        cvFile: data.cvFile,
        expectedSalary:
          typeof data.expectedSalary === "number" ? data.expectedSalary : null,
      },
    });
  }
  public static async findExisting(userId: number, jobId: number) {
    return prisma.application.findFirst({
      where: { userId, jobId },
    });
  }
  public static async getApplicationWithOwnership(applicationId: number) {
    return prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: { include: { company: true } },
        user: true,
      },
    });
  }
  public static async updateApplicationStatus(
    applicationId: number,
    status: any,
    reviewNote?: string | null
  ) {
    return prisma.application.update({
      where: { id: applicationId },
      data: { status, reviewNote: reviewNote ?? null },
    });
  }
}
