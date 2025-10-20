"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const prisma_1 = require("../../config/prisma");
const analytics_repository_1 = require("../../repositories/analytics/analytics.repository");
const prisma_2 = require("../../generated/prisma");
const analytics_calculators_1 = require("./analytics.calculators");
function parseRange(q) {
    const from = q.from ? new Date(q.from) : undefined;
    const to = q.to ? new Date(q.to) : undefined;
    return { from, to };
}
function calcAge(dob) {
    if (!dob)
        return null;
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate()))
        age--;
    return age;
}
class AnalyticsService {
    static async assertCompanyOwnership(companyId, requesterId, requesterRole) {
        if (requesterRole !== prisma_2.UserRole.ADMIN)
            throw { status: 401, message: "Only admin can view analytics" };
        const company = await analytics_repository_1.AnalyticsRepository.getCompany(companyId);
        if (!company)
            throw { status: 404, message: "Company not found" };
        const ownerId = company.ownerAdminId ?? company.adminId;
        if (ownerId !== requesterId)
            throw { status: 403, message: "You don't own this company" };
        return company;
    }
    static async assertAdminAccess(requesterRole) {
        if (requesterRole !== prisma_2.UserRole.ADMIN)
            throw { status: 401, message: "Only admin can view analytics" };
    }
    static async demographics(params) {
        const { companyId, requesterId, requesterRole, query } = params;
        await this.assertAdminAccess(requesterRole);
        const { from, to } = parseRange(query);
        // For platform-wide analytics, we'll use all users and applications
        const [allUsers, allApplications] = await Promise.all([
            analytics_repository_1.AnalyticsRepository.getAllUsers({ ...(from && { from }), ...(to && { to }) }),
            analytics_repository_1.AnalyticsRepository.getAllApplications({ ...(from && { from }), ...(to && { to }) })
        ]);
        const { ageBuckets, gender, locations, totalApplicants } = (0, analytics_calculators_1.calculateDemographics)(allUsers);
        return { ageBuckets, gender, locations, totalApplicants };
    }
    static async salaryTrends(params) {
        const { companyId, requesterId, requesterRole, query } = params;
        await this.assertAdminAccess(requesterRole);
        const { from, to } = parseRange(query);
        const trendsParams = {};
        if (from)
            trendsParams.from = from;
        if (to)
            trendsParams.to = to;
        const expectedByCityTitle = await analytics_repository_1.AnalyticsRepository.platformSalaryTrends(trendsParams);
        const reviewStats = await analytics_repository_1.AnalyticsRepository.platformReviewSalaryStats();
        const { byPosition, byLocation } = (0, analytics_calculators_1.aggregateSalaryTrends)(expectedByCityTitle);
        return { byPosition, byLocation, expectedSalary: expectedByCityTitle, reviewSalary: reviewStats };
    }
    static async interests(params) {
        const { companyId, requesterId, requesterRole, query } = params;
        await this.assertAdminAccess(requesterRole);
        const { from, to } = parseRange(query);
        const catParams = {};
        if (from)
            catParams.from = from;
        if (to)
            catParams.to = to;
        const byCategory = await analytics_repository_1.AnalyticsRepository.platformJobCategories(catParams);
        return (0, analytics_calculators_1.transformInterests)(byCategory);
    }
    static async overview(params) {
        const { companyId, requesterId, requesterRole, query } = params;
        await this.assertAdminAccess(requesterRole);
        const { from, to } = parseRange(query);
        // Platform-wide totals
        const [usersTotal, companiesTotal, jobsTotal, appsTotal] = await Promise.all([
            prisma_1.prisma.user.count(),
            prisma_1.prisma.company.count(),
            prisma_1.prisma.job.count(),
            prisma_1.prisma.application.count({
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
        const statusParams = {};
        if (from)
            statusParams.from = from;
        if (to)
            statusParams.to = to;
        const statusCounts = await analytics_repository_1.AnalyticsRepository.platformApplicationStatusCounts(statusParams);
        const topParams = {};
        if (from)
            topParams.from = from;
        if (to)
            topParams.to = to;
        const topCities = await analytics_repository_1.AnalyticsRepository.platformTopCities(topParams);
        return {
            totals: { usersTotal, companiesTotal, jobsTotal, applicationsTotal: appsTotal },
            applicationStatus: statusCounts.map((s) => ({ status: s.status, count: s._count.status })),
            topCities, // [{ city, count }]
        };
    }
    static async engagement(params) {
        const { companyId, requesterId, requesterRole, query } = params;
        await this.assertAdminAccess(requesterRole);
        const { from, to } = parseRange(query);
        // Daily/Monthly Active Users
        const dau = await analytics_repository_1.AnalyticsRepository.platformDailyActiveUsers({ ...(from && { from }), ...(to && { to }) });
        const mau = await analytics_repository_1.AnalyticsRepository.platformMonthlyActiveUsers({ ...(from && { from }), ...(to && { to }) });
        // Session metrics
        const sessionMetrics = await analytics_repository_1.AnalyticsRepository.platformSessionMetrics({ ...(from && { from }), ...(to && { to }) });
        // Page views
        const pageViews = await analytics_repository_1.AnalyticsRepository.platformPageViews({ ...(from && { from }), ...(to && { to }) });
        return {
            dau,
            mau,
            sessionMetrics,
            pageViews,
        };
    }
    static async conversionFunnel(params) {
        const { companyId, requesterId, requesterRole, query } = params;
        await this.assertAdminAccess(requesterRole);
        const { from, to } = parseRange(query);
        const funnelData = await analytics_repository_1.AnalyticsRepository.platformConversionFunnelData({ ...(from && { from }), ...(to && { to }) });
        return funnelData;
    }
    static async retention(params) {
        const { companyId, requesterId, requesterRole, query } = params;
        await this.assertAdminAccess(requesterRole);
        const { from, to } = parseRange(query);
        const retentionData = await analytics_repository_1.AnalyticsRepository.platformRetentionData({ ...(from && { from }), ...(to && { to }) });
        return retentionData;
    }
    static async performance(params) {
        const { companyId, requesterId, requesterRole, query } = params;
        await this.assertAdminAccess(requesterRole);
        const { from, to } = parseRange(query);
        const performanceData = await analytics_repository_1.AnalyticsRepository.platformPerformanceData({ ...(from && { from }), ...(to && { to }) });
        return performanceData;
    }
}
exports.AnalyticsService = AnalyticsService;
