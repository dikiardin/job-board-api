import { prisma } from "../../config/prisma";

export interface JobFilters {
  keyword?: string | undefined;
  city?: string | undefined;
  limit?: number;
  offset?: number;
  sortBy?: "createdAt";
  sortOrder?: "asc" | "desc";
  postedWithin?: "1" | "3" | "7" | "30";
}

export class GetJobRepository {
  public static async getAllJobs(filters?: JobFilters) {
    const { keyword, city, limit, offset, sortBy, sortOrder, postedWithin } = filters || {};

    const conditions: any[] = [];
    if (keyword) {
      conditions.push({
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { category: { contains: keyword, mode: "insensitive" } },
          { tags: { has: keyword.toLowerCase() } },
          {
            company: {
              is: { name: { contains: keyword, mode: "insensitive" } },
            },
          },
        ],
      });
    }

    if (city) {
      conditions.push({ city: { contains: city, mode: "insensitive" } });
    }

    if (postedWithin) {
      const days = parseInt(postedWithin, 10);
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - days);
      conditions.push({ createdAt: { gte: dateLimit } });
    }

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
        createdAt: true,
      },
      orderBy: {
        [sortBy || "createdAt"]: sortOrder || "desc",
      },
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
            email: true,
            phone: true,
            address: true,
            website: true,
            description: true,
            logoUrl: true,
            locationCity: true,
          },
        },
      },
    });
  }
}
