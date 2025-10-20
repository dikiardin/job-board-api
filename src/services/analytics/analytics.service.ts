import { prisma } from "../../config/prisma";
import { AnalyticsRepository } from "../../repositories/analytics/analytics.repository";
import { UserRole } from "../../generated/prisma";
import { calculateDemographics, aggregateSalaryTrends, transformInterests } from "./analytics.calculators";

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
  static async assertCompanyOwnership(companyId: string | number, requesterId: number, requesterRole: UserRole) {
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only admin can view analytics" };
    const company = await AnalyticsRepository.getCompany(companyId);
    if (!company) throw { status: 404, message: "Company not found" };
    const ownerId = (company as any).ownerAdminId ?? (company as any).adminId;
    if (ownerId !== requesterId) throw { status: 403, message: "You don't own this company" };
    return company;
  }

  static async assertAdminAccess(requesterRole: UserRole) {
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only admin can view analytics" };
  }

  static async demographics(params: { companyId: string | number; requesterId: number; requesterRole: UserRole; query: { from?: string; to?: string } }) {
    const { companyId, requesterId, requesterRole, query } = params;
    await this.assertAdminAccess(requesterRole);
    const { from, to } = parseRange(query);

    // For platform-wide analytics, we'll use all users and applications
    const [allUsers, allApplications] = await Promise.all([
      AnalyticsRepository.getAllUsers({ ...(from && { from }), ...(to && { to }) }),
      AnalyticsRepository.getAllApplications({ ...(from && { from }), ...(to && { to }) })
    ]);

    const { ageBuckets, gender, locations, totalApplicants } = calculateDemographics(allUsers as any[]);
    return { ageBuckets, gender, locations, totalApplicants };
  }

  static async salaryTrends(params: { companyId: string | number; requesterId: number; requesterRole: UserRole; query: { from?: string; to?: string } }) {
    const { companyId, requesterId, requesterRole, query } = params;
    await this.assertAdminAccess(requesterRole);
    const { from, to } = parseRange(query);

    const trendsParams: any = {};
    if (from) trendsParams.from = from;
    if (to) trendsParams.to = to;
    const expectedByCityTitle = await AnalyticsRepository.platformSalaryTrends(trendsParams);
    const reviewStats = await AnalyticsRepository.platformReviewSalaryStats();
    const { byPosition, byLocation } = aggregateSalaryTrends(expectedByCityTitle as any[]);
    return { byPosition, byLocation, expectedSalary: expectedByCityTitle, reviewSalary: reviewStats };
  }

  static async interests(params: { companyId: string | number; requesterId: number; requesterRole: UserRole; query: { from?: string; to?: string } }) {
    const { companyId, requesterId, requesterRole, query } = params;
    await this.assertAdminAccess(requesterRole);
    const { from, to } = parseRange(query);

    const catParams: any = {};
    if (from) catParams.from = from;
    if (to) catParams.to = to;
    const byCategory = await AnalyticsRepository.platformJobCategories(catParams);
    return transformInterests(byCategory);
  }

  static async overview(params: { companyId: string | number; requesterId: number; requesterRole: UserRole; query: { from?: string; to?: string } }) {
    const { companyId, requesterId, requesterRole, query } = params;
    await this.assertAdminAccess(requesterRole);
    const { from, to } = parseRange(query);

    // Platform-wide totals
    const [usersTotal, companiesTotal, jobsTotal, appsTotal] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.job.count(),
      prisma.application.count({
        where: {
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

    const statusParams: any = {};
    if (from) statusParams.from = from;
    if (to) statusParams.to = to;
    const statusCounts = await AnalyticsRepository.platformApplicationStatusCounts(statusParams);

    const topParams: any = {};
    if (from) topParams.from = from;
    if (to) topParams.to = to;
    const topCities = await AnalyticsRepository.platformTopCities(topParams);

    return {
      totals: { usersTotal, companiesTotal, jobsTotal, applicationsTotal: appsTotal },
      applicationStatus: statusCounts.map((s) => ({ status: s.status, count: s._count.status })),
      topCities, // [{ city, count }]
    };
  }

  static async engagement(params: { companyId: string | number; requesterId: number; requesterRole: UserRole; query: { from?: string; to?: string } }) {
    const { companyId, requesterId, requesterRole, query } = params;
    await this.assertAdminAccess(requesterRole);
    const { from, to } = parseRange(query);

    // Daily/Monthly Active Users
    const dau = await AnalyticsRepository.platformDailyActiveUsers({ ...(from && { from }), ...(to && { to }) });
    const mau = await AnalyticsRepository.platformMonthlyActiveUsers({ ...(from && { from }), ...(to && { to }) });

    // Session metrics
    const sessionMetrics = await AnalyticsRepository.platformSessionMetrics({ ...(from && { from }), ...(to && { to }) });

    // Page views
    const pageViews = await AnalyticsRepository.platformPageViews({ ...(from && { from }), ...(to && { to }) });

    return {
      dau,
      mau,
      sessionMetrics,
      pageViews,
    };
  }

  static async conversionFunnel(params: { companyId: string | number; requesterId: number; requesterRole: UserRole; query: { from?: string; to?: string } }) {
    const { companyId, requesterId, requesterRole, query } = params;
    await this.assertAdminAccess(requesterRole);
    const { from, to } = parseRange(query);

    const funnelData = await AnalyticsRepository.platformConversionFunnelData({ ...(from && { from }), ...(to && { to }) });
    return funnelData;
  }

  static async retention(params: { companyId: string | number; requesterId: number; requesterRole: UserRole; query: { from?: string; to?: string } }) {
    const { companyId, requesterId, requesterRole, query } = params;
    await this.assertAdminAccess(requesterRole);
    const { from, to } = parseRange(query);

    const retentionData = await AnalyticsRepository.platformRetentionData({ ...(from && { from }), ...(to && { to }) });
    return retentionData;
  }

  static async performance(params: { companyId: string | number; requesterId: number; requesterRole: UserRole; query: { from?: string; to?: string } }) {
    const { companyId, requesterId, requesterRole, query } = params;
    await this.assertAdminAccess(requesterRole);
    const { from, to } = parseRange(query);

    const performanceData = await AnalyticsRepository.platformPerformanceData({ ...(from && { from }), ...(to && { to }) });
    return performanceData;
  }
}
