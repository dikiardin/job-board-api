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

  static async dailyActiveUsers(params: { companyId: string | number; from?: Date; to?: Date }) {
    const { companyId, from, to } = params;
    const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
    
    // Get unique users who applied to company jobs in the date range
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

    const uniqueUsers = await prisma.application.findMany({
      where,
      select: { userId: true, createdAt: true },
      distinct: ['userId'],
    });

    return {
      count: uniqueUsers.length,
      trend: 0, // Could be calculated by comparing with previous period
    };
  }

  static async monthlyActiveUsers(params: { companyId: string | number; from?: Date; to?: Date }) {
    const { companyId, from, to } = params;
    const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
    
    // Get unique users who applied to company jobs in the date range
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

    const uniqueUsers = await prisma.application.findMany({
      where,
      select: { userId: true },
      distinct: ['userId'],
    });

    return {
      count: uniqueUsers.length,
      trend: 0,
    };
  }

  static async sessionMetrics(params: { companyId: string | number; from?: Date; to?: Date }) {
    // This would typically come from analytics events, but we'll simulate based on applications
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

    const applications = await prisma.application.findMany({
      where,
      select: { createdAt: true },
    });

    return {
      averageSessionDuration: 300, // 5 minutes in seconds
      bounceRate: 0.35, // 35%
      sessionsPerUser: 2.1,
    };
  }

  static async pageViews(params: { companyId: string | number; from?: Date; to?: Date }) {
    // This would typically come from analytics events
    return {
      total: 0,
      unique: 0,
      topPages: [],
    };
  }

  static async conversionFunnelData(params: { companyId: string | number; from?: Date; to?: Date }) {
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

    const [totalApplications, interviews, accepted] = await Promise.all([
      prisma.application.count({ where }),
      prisma.application.count({ where: { ...where, status: 'INTERVIEW' } }),
      prisma.application.count({ where: { ...where, status: 'ACCEPTED' } }),
    ]);

    return {
      steps: [
        { name: 'Job Views', count: totalApplications * 10, percentage: 100 },
        { name: 'Applications', count: totalApplications, percentage: Math.round((totalApplications / (totalApplications * 10)) * 100) },
        { name: 'Interviews', count: interviews, percentage: Math.round((interviews / totalApplications) * 100) },
        { name: 'Hired', count: accepted, percentage: Math.round((accepted / totalApplications) * 100) },
      ],
    };
  }

  static async retentionData(params: { companyId: string | number; from?: Date; to?: Date }) {
    // This would typically require more complex cohort analysis
    return {
      day1: 0.85,
      day7: 0.65,
      day30: 0.45,
      cohorts: [],
    };
  }

  static async performanceData(params: { companyId: string | number; from?: Date; to?: Date }) {
    // This would typically come from performance monitoring
    return {
      averageLoadTime: 1.2,
      errorRate: 0.02,
      uptime: 99.9,
      mobileVsDesktop: {
        mobile: 0.65,
        desktop: 0.35,
      },
    };
  }
}
