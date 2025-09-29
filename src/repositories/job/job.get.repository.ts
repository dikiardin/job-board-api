import { prisma } from "../../config/prisma";

export class GetJobRepository {
  public static async getAllJobs() {
    return prisma.job.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        category: true,
        city: true,
        salaryMin: true,
        salaryMax: true,
        tags: true,
        company: {
          select: {
            name: true,
            logo: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async findById(jobId: number) {
    return prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            location: true,
          },
        },
      },
    });
  }
}
