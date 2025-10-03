import { prisma } from "../../config/prisma";
import { Prisma } from "../../generated/prisma";

export class AnalyticsRepository {
  static async getCompany(companyId: string | number) {
    const id = typeof companyId === 'string' ? Number(companyId) : companyId;
    return prisma.company.findUnique({ where: { id } });
  }

  static async getCompanyApplications(params: { companyId: string | number; from?: Date; to?: Date }) {
    const { companyId, from, to } = params;
    const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
    const where: Prisma.ApplicationWhereInput = {
      job: { companyId: cid },
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

  static async applicationStatusCounts(params: { companyId: string | number; from?: Date; to?: Date }) {
    const { companyId, from, to } = params;
    const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
    const where: Prisma.ApplicationWhereInput = {
      job: { companyId: cid },
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

  static async applicationsByCategory(params: { companyId: string | number; from?: Date; to?: Date }) {
    const { companyId, from, to } = params;
    const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
    const where: Prisma.ApplicationWhereInput = {
      job: { companyId: cid },
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

  static async expectedSalaryByCityAndTitle(params: { companyId: string | number; from?: Date; to?: Date }) {
    const { companyId, from, to } = params;
    const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
    const where: Prisma.ApplicationWhereInput = {
      job: { companyId: cid },
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

  static async topCitiesByApplications(params: { companyId: string | number; from?: Date; to?: Date }) {
    const { companyId, from, to } = params;
    const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
    const where: Prisma.ApplicationWhereInput = {
      job: { companyId: cid },
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

  static async companyReviewSalaryStats(companyId: string | number) {
    const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
    // Reviews linked via Employment -> CompanyReview
    const reviews = await prisma.companyReview.findMany({
      where: { companyId: cid },
    });
    if (!reviews.length) return { avgSalaryEstimate: null, samples: 0 };
    const has = reviews.filter((r) => (r.salaryEstimateMin != null && r.salaryEstimateMax != null));
    const avg = has.length ? Math.round(has.reduce((s, r) => s + Math.round(((r.salaryEstimateMin as number) + (r.salaryEstimateMax as number)) / 2), 0) / has.length) : null;
    return { avgSalaryEstimate: avg, samples: has.length };
  }
}
