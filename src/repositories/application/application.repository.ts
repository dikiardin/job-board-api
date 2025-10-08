import { prisma } from "../../config/prisma";

export class ApplicationRepo {
  public static async createApplication(data: {
    userId: number;
    jobId: number | string;
    cvUrl: string;
    cvFileName?: string | null;
    cvFileSize?: number | null;
    expectedSalary?: number;
    isPriority?: boolean;
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
        isPriority: data.isPriority ?? false,
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

  public static async getApplicationsByUserId(
    userId: number,
    page = 1,
    limit = 10
  ) {
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { userId },
        select: {
          id: true,
          userId: true,
          jobId: true,
          cvUrl: true,
          cvFileName: true,
          cvFileSize: true,
          expectedSalary: true,
          expectedSalaryCurrency: true,
          status: true,
          reviewNote: true,
          reviewUpdatedAt: true,
          referralSource: true,
          createdAt: true,
          updatedAt: true,
          isPriority: true, // ← Include priority field
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
          timeline: { orderBy: { createdAt: "asc" } },
          interviews: { orderBy: { startsAt: "asc" } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.application.count({ where: { userId } }),
    ]);

    return { applications, total };
  }

  public static async getApplicationsForEmployer(
    companyId: number,
    page = 1,
    limit = 10,
    status?: string
  ) {
    const skip = (page - 1) * limit;

    const whereClause: any = {
      job: { companyId },
    };

    if (status) {
      whereClause.status = status;
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: whereClause,
        select: {
          id: true,
          userId: true,
          jobId: true,
          cvUrl: true,
          cvFileName: true,
          cvFileSize: true,
          expectedSalary: true,
          expectedSalaryCurrency: true,
          status: true,
          reviewNote: true,
          reviewUpdatedAt: true,
          referralSource: true,
          createdAt: true,
          updatedAt: true,
          isPriority: true, // ← IMPORTANT: Include priority field
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              profilePicture: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          timeline: { orderBy: { createdAt: "asc" } },
        },
        orderBy: [
          { isPriority: "desc" }, // Priority applications first
          { createdAt: "desc" },  // Then by newest
        ],
        skip,
        take: limit,
      }),
      prisma.application.count({ where: whereClause }),
    ]);

    return { applications, total };
  }
}
