import { prisma } from "../../config/prisma";
import { Prisma } from "../../generated/prisma";
import * as Platform from "./analytics.platform.repository";
import * as Company from "./analytics.company.repository";

export class AnalyticsRepository {
  static async getCompany(companyId: string | number) {
    const id = typeof companyId === 'string' ? Number(companyId) : companyId;
    return prisma.company.findUnique({ where: { id } });
  }

  // Platform-wide methods
  static async getAllUsers(params: { from?: Date; to?: Date }) {
    return Platform.getAllUsers(params);
  }

  static async getAllApplications(params: { from?: Date; to?: Date }) {
    return Platform.getAllApplications(params);
  }

  static async getAllCompanies() {
    return Platform.getAllCompanies();
  }

  static async platformSalaryTrends(params: { from?: Date; to?: Date }) {
    return Platform.platformSalaryTrends(params);
  }

  static async platformReviewSalaryStats() {
    return Platform.platformReviewSalaryStats();
  }

  static async platformJobCategories(params: { from?: Date; to?: Date }) {
    return Platform.platformJobCategories(params);
  }

  static async platformApplicationStatusCounts(params: { from?: Date; to?: Date }) {
    return Platform.platformApplicationStatusCounts(params);
  }

  static async platformTopCities(params: { from?: Date; to?: Date }) {
    return Platform.platformTopCities(params);
  }

  static async platformDailyActiveUsers(params: { from?: Date; to?: Date }) {
    return Platform.platformDailyActiveUsers(params);
  }

  static async platformMonthlyActiveUsers(params: { from?: Date; to?: Date }) {
    return Platform.platformMonthlyActiveUsers(params);
  }

  static async platformSessionMetrics(params: { from?: Date; to?: Date }) {
    return Platform.platformSessionMetrics(params);
  }

  static async platformPageViews(params: { from?: Date; to?: Date }) {
    return Platform.platformPageViews(params);
  }

  static async platformConversionFunnelData(params: { from?: Date; to?: Date }) {
    return Platform.platformConversionFunnelData(params);
  }

  static async platformRetentionData(params: { from?: Date; to?: Date }) {
    return Platform.platformRetentionData(params);
  }

  static async platformPerformanceData(params: { from?: Date; to?: Date }) {
    return Platform.platformPerformanceData(params);
  }

  // Company-scoped methods remain inline
  static async getCompanyApplications(params: { companyId: string | number; from?: Date; to?: Date }) { return Company.getCompanyApplications(params); }

  static async applicationStatusCounts(params: { companyId: string | number; from?: Date; to?: Date }) { return Company.applicationStatusCounts(params); }

  static async applicationsByCategory(params: { companyId: string | number; from?: Date; to?: Date }) { return Company.applicationsByCategory(params); }

  static async expectedSalaryByCityAndTitle(params: { companyId: string | number; from?: Date; to?: Date }) { return Company.expectedSalaryByCityAndTitle(params); }

  static async topCitiesByApplications(params: { companyId: string | number; from?: Date; to?: Date }) { return Company.topCitiesByApplications(params); }

  static async companyReviewSalaryStats(companyId: string | number) { return Company.companyReviewSalaryStats(companyId); }

  static async dailyActiveUsers(params: { companyId: string | number; from?: Date; to?: Date }) { return Company.dailyActiveUsers(params); }

  static async monthlyActiveUsers(params: { companyId: string | number; from?: Date; to?: Date }) { return Company.monthlyActiveUsers(params); }

  static async sessionMetrics(params: { companyId: string | number; from?: Date; to?: Date }) { return Company.sessionMetrics(params); }

  static async pageViews(params: { companyId: string | number; from?: Date; to?: Date }) { return Company.pageViews(params); }

  static async conversionFunnelData(params: { companyId: string | number; from?: Date; to?: Date }) { return Company.conversionFunnelData(params); }

  static async retentionData(params: { companyId: string | number; from?: Date; to?: Date }) { return Company.retentionData(params); }

  static async performanceData(params: { companyId: string | number; from?: Date; to?: Date }) { return Company.performanceData(params); }
}
