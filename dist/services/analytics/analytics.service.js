"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const prisma_1 = require("../../config/prisma");
const analytics_repository_1 = require("../../repositories/analytics/analytics.repository");
const prisma_2 = require("../../generated/prisma");
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
    static async demographics(params) {
        const { companyId, requesterId, requesterRole, query } = params;
        await this.assertCompanyOwnership(companyId, requesterId, requesterRole);
        const { from, to } = parseRange(query);
        const appParams = { companyId };
        if (from)
            appParams.from = from;
        if (to)
            appParams.to = to;
        const applications = await analytics_repository_1.AnalyticsRepository.getCompanyApplications(appParams);
        // Age buckets
        const ageBuckets = {
            "18-24": 0,
            "25-34": 0,
            "35-44": 0,
            "45-54": 0,
            "55+": 0,
            unknown: 0,
        };
        const inc = (key) => {
            ageBuckets[key] = (ageBuckets[key] ?? 0) + 1;
        };
        const genderCounts = new Map();
        const locationCounts = new Map();
        for (const a of applications) {
            const u = (a.user ?? {});
            const age = calcAge(u?.dob ?? undefined);
            if (age == null)
                inc("unknown");
            else if (age < 25)
                inc("18-24");
            else if (age < 35)
                inc("25-34");
            else if (age < 45)
                inc("35-44");
            else if (age < 55)
                inc("45-54");
            else
                inc("55+");
            const g = (u?.gender || "Unknown").toString();
            genderCounts.set(g, (genderCounts.get(g) || 0) + 1);
            // Use job city primarily for "location" of applications to company
            const city = (a.job?.city) || "Unknown";
            locationCounts.set(city, (locationCounts.get(city) || 0) + 1);
        }
        return {
            ageBuckets,
            gender: Array.from(genderCounts.entries()).map(([gender, count]) => ({ gender, count })),
            locations: Array.from(locationCounts.entries()).map(([city, count]) => ({ city, count })),
            totalApplicants: applications.length,
        };
    }
    static async salaryTrends(params) {
        const { companyId, requesterId, requesterRole, query } = params;
        await this.assertCompanyOwnership(companyId, requesterId, requesterRole);
        const { from, to } = parseRange(query);
        const trendsParams = { companyId };
        if (from)
            trendsParams.from = from;
        if (to)
            trendsParams.to = to;
        const expectedByCityTitle = await analytics_repository_1.AnalyticsRepository.expectedSalaryByCityAndTitle(trendsParams);
        const reviewStats = await analytics_repository_1.AnalyticsRepository.companyReviewSalaryStats(companyId);
        return {
            expectedSalary: expectedByCityTitle, // [{ city, title, avgExpectedSalary, samples }]
            reviewSalary: reviewStats, // { avgSalaryEstimate, samples }
        };
    }
    static async interests(params) {
        const { companyId, requesterId, requesterRole, query } = params;
        await this.assertCompanyOwnership(companyId, requesterId, requesterRole);
        const { from, to } = parseRange(query);
        const catParams = { companyId };
        if (from)
            catParams.from = from;
        if (to)
            catParams.to = to;
        const byCategory = await analytics_repository_1.AnalyticsRepository.applicationsByCategory(catParams);
        return { byCategory };
    }
    static async overview(params) {
        const { companyId, requesterId, requesterRole, query } = params;
        await this.assertCompanyOwnership(companyId, requesterId, requesterRole);
        const { from, to } = parseRange(query);
        // Totals
        const [usersTotal, jobsTotal, appsTotal] = await Promise.all([
            prisma_1.prisma.user.count(),
            prisma_1.prisma.job.count({ where: { companyId: (typeof companyId === 'string' ? Number(companyId) : companyId) } }),
            prisma_1.prisma.application.count({
                where: {
                    job: { companyId: (typeof companyId === 'string' ? Number(companyId) : companyId) },
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
        const statusParams = { companyId };
        if (from)
            statusParams.from = from;
        if (to)
            statusParams.to = to;
        const statusCounts = await analytics_repository_1.AnalyticsRepository.applicationStatusCounts(statusParams);
        const topParams = { companyId };
        if (from)
            topParams.from = from;
        if (to)
            topParams.to = to;
        const topCities = await analytics_repository_1.AnalyticsRepository.topCitiesByApplications(topParams);
        return {
            totals: { usersTotal, jobsTotal, applicationsTotal: appsTotal },
            applicationStatus: statusCounts.map((s) => ({ status: s.status, count: s._count.status })),
            topCities, // [{ city, count }]
        };
    }
}
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=analytics.service.js.map