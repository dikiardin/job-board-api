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
        // Process users for demographics
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
        // Process all users for demographics
        for (const user of allUsers) {
            // Prioritize UserProfile data over User data
            const gender = user.profile?.gender || user.gender || "Unknown";
            const dob = user.profile?.dob || user.dob;
            const city = user.profile?.city || user.city || "Unknown";
            const age = calcAge(dob);
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
            // Normalize gender values
            let normalizedGender = gender.toString().toLowerCase().trim();
            if (normalizedGender === "" || normalizedGender === "null" || normalizedGender === "undefined") {
                normalizedGender = "Unknown";
            }
            else if (normalizedGender === "m" || normalizedGender === "male" || normalizedGender === "laki-laki") {
                normalizedGender = "Male";
            }
            else if (normalizedGender === "f" || normalizedGender === "female" || normalizedGender === "perempuan") {
                normalizedGender = "Female";
            }
            else if (normalizedGender !== "male" && normalizedGender !== "female" && normalizedGender !== "other") {
                // Capitalize first letter for other values
                normalizedGender = normalizedGender.charAt(0).toUpperCase() + normalizedGender.slice(1);
            }
            genderCounts.set(normalizedGender, (genderCounts.get(normalizedGender) || 0) + 1);
            // Use user's city for location
            locationCounts.set(city, (locationCounts.get(city) || 0) + 1);
        }
        const genderData = Array.from(genderCounts.entries()).map(([gender, count]) => ({ gender, count }));
        return {
            ageBuckets,
            gender: genderData,
            locations: Array.from(locationCounts.entries()).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count),
            totalApplicants: allUsers.length,
        };
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
        // Transform data to match frontend expectations
        const byTitle = new Map();
        for (const row of expectedByCityTitle || []) {
            const cur = byTitle.get(row.title) || { sum: 0, n: 0, min: Number.POSITIVE_INFINITY, max: 0 };
            cur.sum += row.avgExpectedSalary * (row.samples || 1);
            cur.n += (row.samples || 1);
            cur.min = Math.min(cur.min, row.avgExpectedSalary);
            cur.max = Math.max(cur.max, row.avgExpectedSalary);
            byTitle.set(row.title, cur);
        }
        const byPosition = Array.from(byTitle.entries()).map(([position, v]) => ({
            position,
            min: v.min === Number.POSITIVE_INFINITY ? 0 : Math.round(v.min),
            max: Math.round(v.max),
            avg: v.n ? Math.round(v.sum / v.n) : 0,
            count: v.n,
        }));
        // Aggregate by location (city)
        const byCity = new Map();
        for (const row of expectedByCityTitle || []) {
            const cur = byCity.get(row.city) || { sum: 0, n: 0 };
            cur.sum += row.avgExpectedSalary * (row.samples || 1);
            cur.n += (row.samples || 1);
            byCity.set(row.city, cur);
        }
        const byLocation = Array.from(byCity.entries()).map(([city, v]) => ({
            city,
            avg: v.n ? Math.round(v.sum / v.n) : 0,
            growth: 0,
        }));
        return {
            byPosition,
            byLocation,
            expectedSalary: expectedByCityTitle, // [{ city, title, avgExpectedSalary, samples }]
            reviewSalary: reviewStats, // { avgSalaryEstimate, samples }
        };
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
        // Transform data to match frontend expectations
        const total = byCategory.reduce((s, x) => s + (x.count || 0), 0) || 1;
        const transformedData = byCategory.map((x) => ({
            category: x.category,
            applications: x.count,
            percentage: Math.round((x.count * 100) / total)
        }));
        return transformedData;
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
