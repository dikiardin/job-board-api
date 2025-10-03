import { prisma } from "../../config/prisma";
import { AnalyticsRepository } from "../../repositories/analytics/analytics.repository";
import { UserRole } from "../../generated/prisma";

function parseRange(q: { from?: string; to?: string }) {
  const from = q.from ? new Date(q.from) : undefined;
  const to = q.to ? new Date(q.to) : undefined;
  return { from, to };
}

function calcAge(dob?: Date | null): number | null {
  if (!dob) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

export class AnalyticsService {
  static async assertCompanyOwnership(companyId: string, requesterId: number, requesterRole: UserRole) {
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only admin can view analytics" };
    const company = await AnalyticsRepository.getCompany(companyId);
    if (!company) throw { status: 404, message: "Company not found" };
    if (company.adminId !== requesterId) throw { status: 403, message: "You don't own this company" };
    return company;
  }

  static async demographics(params: { companyId: string; requesterId: number; requesterRole: UserRole; query: { from?: string; to?: string } }) {
    const { companyId, requesterId, requesterRole, query } = params;
    await this.assertCompanyOwnership(companyId, requesterId, requesterRole);
    const { from, to } = parseRange(query);

    const appParams: any = { companyId };
    if (from) appParams.from = from;
    if (to) appParams.to = to;
    const applications = await AnalyticsRepository.getCompanyApplications(appParams);

    // Age buckets
    const ageBuckets = {
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45-54": 0,
      "55+": 0,
      unknown: 0,
    } as Record<string, number>;

    const inc = (key: string) => {
      ageBuckets[key] = (ageBuckets[key] ?? 0) + 1;
    };

    const genderCounts = new Map<string, number>();
    const locationCounts = new Map<string, number>();

    for (const a of applications) {
      const u = ((a as any).user ?? {}) as { gender?: string | null; dob?: Date | null; address?: string | null; name?: string };
      const age = calcAge(u?.dob ?? undefined);
      if (age == null) inc("unknown");
      else if (age < 25) inc("18-24");
      else if (age < 35) inc("25-34");
      else if (age < 45) inc("35-44");
      else if (age < 55) inc("45-54");
      else inc("55+");

      const g = (u?.gender || "Unknown").toString();
      genderCounts.set(g, (genderCounts.get(g) || 0) + 1);

      // Use job city primarily for "location" of applications to company
      const city = (((a as any).job?.city) as string) || "Unknown";
      locationCounts.set(city, (locationCounts.get(city) || 0) + 1);
    }

    return {
      ageBuckets,
      gender: Array.from(genderCounts.entries()).map(([gender, count]) => ({ gender, count })),
      locations: Array.from(locationCounts.entries()).map(([city, count]) => ({ city, count })),
      totalApplicants: applications.length,
    };
  }

  static async salaryTrends(params: { companyId: string; requesterId: number; requesterRole: UserRole; query: { from?: string; to?: string } }) {
    const { companyId, requesterId, requesterRole, query } = params;
    await this.assertCompanyOwnership(companyId, requesterId, requesterRole);
    const { from, to } = parseRange(query);

    const trendsParams: any = { companyId };
    if (from) trendsParams.from = from;
    if (to) trendsParams.to = to;
    const expectedByCityTitle = await AnalyticsRepository.expectedSalaryByCityAndTitle(trendsParams);
    const reviewStats = await AnalyticsRepository.companyReviewSalaryStats(companyId);

    return {
      expectedSalary: expectedByCityTitle, // [{ city, title, avgExpectedSalary, samples }]
      reviewSalary: reviewStats, // { avgSalaryEstimate, samples }
    };
  }

  static async interests(params: { companyId: string; requesterId: number; requesterRole: UserRole; query: { from?: string; to?: string } }) {
    const { companyId, requesterId, requesterRole, query } = params;
    await this.assertCompanyOwnership(companyId, requesterId, requesterRole);
    const { from, to } = parseRange(query);

    const catParams: any = { companyId };
    if (from) catParams.from = from;
    if (to) catParams.to = to;
    const byCategory = await AnalyticsRepository.applicationsByCategory(catParams);
    return { byCategory };
  }

  static async overview(params: { companyId: string; requesterId: number; requesterRole: UserRole; query: { from?: string; to?: string } }) {
    const { companyId, requesterId, requesterRole, query } = params;
    await this.assertCompanyOwnership(companyId, requesterId, requesterRole);
    const { from, to } = parseRange(query);

    // Totals
    const [usersTotal, jobsTotal, appsTotal] = await Promise.all([
      prisma.user.count(),
      prisma.job.count({ where: { companyId } }),
      prisma.application.count({
        where: {
          job: { companyId },
          ...(from || to
            ? {
                createdAt: {
                  ...(from ? { gte: from } : {}),
                  ...(to ? { lte: to } : {}),
                },
              }
            : {}),
        },
      }),
    ]);

    const statusParams: any = { companyId };
    if (from) statusParams.from = from;
    if (to) statusParams.to = to;
    const statusCounts = await AnalyticsRepository.applicationStatusCounts(statusParams);

    const topParams: any = { companyId };
    if (from) topParams.from = from;
    if (to) topParams.to = to;
    const topCities = await AnalyticsRepository.topCitiesByApplications(topParams);

    return {
      totals: { usersTotal, jobsTotal, applicationsTotal: appsTotal },
      applicationStatus: statusCounts.map((s) => ({ status: s.status, count: s._count.status })),
      topCities, // [{ city, count }]
    };
  }
}
