import { prisma } from "../../config/prisma";
import { Prisma } from "../../generated/prisma";

export class JobRepository {
  static async getCompany(companyId: number) {
    return prisma.company.findUnique({ where: { id: companyId } });
  }

  static async createJob(companyId: number, data: {
    title: string;
    description: string;
    banner?: string | null;
    category: string;
    city: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    tags: string[];
    deadline?: Date | null;
    isPublished?: boolean;
  }) {
    return prisma.job.create({
      data: {
        companyId,
        title: data.title,
        description: data.description,
        banner: data.banner ?? null,
        category: data.category,
        city: data.city,
        salaryMin: data.salaryMin ?? null,
        salaryMax: data.salaryMax ?? null,
        tags: data.tags,
        deadline: data.deadline ?? null,
        isPublished: data.isPublished ?? false,
      },
    });
  }

  static async updateJob(companyId: number, jobId: number, data: Partial<{
    title: string;
    description: string;
    banner?: string | null;
    category: string;
    city: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    tags: string[];
    deadline?: Date | null;
    isPublished?: boolean;
  }>) {
    return prisma.job.update({
      where: { id: jobId },
      data: {
        ...data,
      },
    });
  }

  static async getJobById(companyId: number, jobId: number) {
    return prisma.job.findFirst({
      where: { id: jobId, companyId },
      include: {
        _count: { select: { applications: true } },
        applications: {
          include: {
            user: true,
          },
        },
        preselectionTests: {
          include: {
            results: true,
          },
        },
      },
    });
  }

  static async togglePublish(jobId: number, isPublished: boolean) {
    return prisma.job.update({ where: { id: jobId }, data: { isPublished } });
  }

  static async deleteJob(companyId: number, jobId: number) {
    return prisma.job.delete({ where: { id: jobId } });
  }

  static async listJobs(params: {
    companyId: number;
    title?: string;
    category?: string;
    sortBy?: "createdAt" | "deadline";
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }) {
    const { companyId, title, category, sortBy = "createdAt", sortOrder = "desc", limit = 10, offset = 0 } = params;

    const where: Prisma.JobWhereInput = {
      companyId,
      ...(title ? { title: { contains: title, mode: "insensitive" } } : {}),
      ...(category ? { category: { equals: category } } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: sortBy === "deadline" ? { deadline: sortOrder } : { createdAt: sortOrder },
        skip: offset,
        take: limit,
        include: {
          _count: { select: { applications: true } },
        },
      }),
      prisma.job.count({ where }),
    ]);

    return { items, total, limit, offset };
  }
}
