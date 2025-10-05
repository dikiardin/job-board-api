import { prisma } from "../../config/prisma";

export class GetJobRepository {
  public static async getAllJobs(filters?: {
    keyword?: string;
    city?: string;
    limit?: number;
    offset?: number;
  }) {
    const { keyword, city, limit, offset } = filters || {};

    const conditions: any[] = [];
    if (keyword) {
      conditions.push({
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { category: { contains: keyword, mode: "insensitive" } },
          {
            company: {
              is: { name: { contains: keyword, mode: "insensitive" } },
            },
          },
        ],
      });
    }
    if (city)
      conditions.push({ city: { contains: city, mode: "insensitive" } });

    return prisma.job.findMany({
      where: {
        isPublished: true,
        AND: conditions,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        city: true,
        salaryMin: true,
        salaryMax: true,
        tags: true,
        company: { select: { name: true, logoUrl: true } },
      },
      orderBy: { createdAt: "desc" },
      ...(limit !== undefined ? { take: limit } : {}),
      ...(offset !== undefined ? { skip: offset } : {}),
    });
  }

  public static async countJobs(filters?: { keyword?: string; city?: string }) {
    const { keyword, city } = filters || {};

    return prisma.job.count({
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
    });
  }

  public static async findBySlug(slug: string) {
    return prisma.job.findUnique({
      where: { slug },
      include: {
        company: {
          select: {
            id: true,
            slug: true,
            name: true,
            logoUrl: true,
            locationCity: true,
          },
        },
      },
    });
  }
}
