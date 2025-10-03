import { prisma } from "../../config/prisma";
import { Prisma } from "../../generated/prisma";

export class AnalyticsRepository {
  static async getCompany(companyId: string) {
    return prisma.company.findUnique({ where: { id: companyId } });
  }

  static async getCompanyApplications(params: { companyId: string; from?: Date; to?: Date }) {
    const { companyId, from, to } = params;
    const where: Prisma.ApplicationWhereInput = {
      job: { companyId },
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    };

    return prisma.application.findMany({
      where,
      include: { user: true, job: true },
    });
  }

  static async applicationStatusCounts(params: { companyId: string; from?: Date; to?: Date }) {
    const { companyId, from, to } = params;
    const where: Prisma.ApplicationWhereInput = {
      job: { companyId },
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    };

    const grouped = await prisma.application.groupBy({
      by: ["status"],
      where,
      _count: { status: true },
    });
    return grouped;
  }

  static async applicationsByCategory(params: { companyId: string; from?: Date; to?: Date }) {
    const { companyId, from, to } = params;
    const where: Prisma.ApplicationWhereInput = {
      job: { companyId },
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    };

    const items = await prisma.application.findMany({ where, include: { job: true } });
    const map = new Map<string, number>();
    for (const a of items) {
      const cat = (a as any).job.category as string;
      map.set(cat, (map.get(cat) || 0) + 1);
    }
    return Array.from(map.entries()).map(([category, count]) => ({ category, count }));
  }

  static async expectedSalaryByCityAndTitle(params: { companyId: string; from?: Date; to?: Date }) {
    const { companyId, from, to } = params;
    const where: Prisma.ApplicationWhereInput = {
      job: { companyId },
      expectedSalary: { not: null },
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    };

    const items = await prisma.application.findMany({ where, include: { job: true } });
    type Key = string; // `${city}|${title}`
    const agg = new Map<Key, { city: string; title: string; sum: number; n: number }>();
    for (const a of items) {
      const city = ((a as any).job.city as string) || "Unknown";
      const title = ((a as any).job.title as string) || "Unknown";
      const key = `${city}|${title}`;
      const expected = (a.expectedSalary as number) || 0;
      const cur = agg.get(key) || { city, title, sum: 0, n: 0 };
      cur.sum += expected;
      cur.n += 1;
      agg.set(key, cur);
    }
    return Array.from(agg.values()).map((v) => ({ city: v.city, title: v.title, avgExpectedSalary: v.n ? Math.round(v.sum / v.n) : 0, samples: v.n }));
  }

  static async topCitiesByApplications(params: { companyId: string; from?: Date; to?: Date }) {
    const { companyId, from, to } = params;
    const where: Prisma.ApplicationWhereInput = {
      job: { companyId },
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    };
    const items = await prisma.application.findMany({ where, include: { job: true } });
    const map = new Map<string, number>();
    for (const a of items) {
      const city = ((a as any).job.city as string) || "Unknown";
      map.set(city, (map.get(city) || 0) + 1);
    }
    return Array.from(map.entries()).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count);
  }

  static async companyReviewSalaryStats(companyId: string) {
    // Reviews linked via Employment -> CompanyReview
    const reviews = await prisma.companyReview.findMany({
      where: { employment: { companyId } },
    });
    if (!reviews.length) return { avgSalaryEstimate: null, samples: 0 };
    const has = reviews.filter((r) => r.salaryEstimate != null);
    const avg = has.length ? Math.round(has.reduce((s, r) => s + (r.salaryEstimate as number), 0) / has.length) : null;
    return { avgSalaryEstimate: avg, samples: has.length };
  }
}
