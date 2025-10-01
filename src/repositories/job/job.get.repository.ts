import { prisma } from "../../config/prisma";

export class GetJobRepository {
  public static async getAllJobs(filters?: {
    keyword?: string;
    city?: string;
  }) {
    const { keyword, city } = filters || {};

    return prisma.job.findMany({
      where: {
        isPublished: true,
        AND: [
          keyword
            ? {
                OR: [
                  { title: { contains: keyword, mode: "insensitive" } },
                  { category: { contains: keyword, mode: "insensitive" } },
                  {
                    company: {
                      is: { name: { contains: keyword, mode: "insensitive" } },
                    },
                  },
                ],
              }
            : {},
          city ? { city: { contains: city, mode: "insensitive" } } : {},
        ],
      },
      select: {
        id: true,
        title: true,
        category: true,
        city: true,
        salaryMin: true,
        salaryMax: true,
        tags: true,
        company: { select: { name: true, logo: true } },
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
