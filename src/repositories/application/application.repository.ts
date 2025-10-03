import { prisma } from "../../config/prisma";

export class ApplicationRepo {
  public static async createApplication(data: {
    userId: number;
    jobId: number | string;
    cvUrl: string;
    cvFileName?: string | null;
    cvFileSize?: number | null;
    expectedSalary?: number;
  }) {
    return prisma.application.create({
      data: {
        userId: data.userId,
        jobId: typeof data.jobId === "string" ? Number(data.jobId) : data.jobId,
        cvUrl: data.cvUrl,
        cvFileName: data.cvFileName ?? null,
        cvFileSize: data.cvFileSize ?? null,
        expectedSalary:
          typeof data.expectedSalary === "number" ? data.expectedSalary : null,
      },
    });
  }

  public static async findExisting(userId: number, jobId: number | string) {
    return prisma.application.findFirst({
      where: {
        userId,
        jobId: typeof jobId === "string" ? Number(jobId) : jobId,
      },
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
      data: {
        status,
        reviewNote: reviewNote ?? null,
        reviewUpdatedAt: new Date(),
      },
    });
  }

  public static async getApplicationsByUserId(userId: number) {
    return prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          select: {
            id: true,
            slug: true,
            title: true,
            city: true,
            category: true,
            salaryMin: true,
            salaryMax: true,
            company: {
              select: {
                id: true,
                slug: true,
                name: true,
                logoUrl: true,
              },
            },
          },
        },
        timeline: {
          orderBy: { createdAt: "asc" },
        },
        interviews: {
          orderBy: { startsAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
