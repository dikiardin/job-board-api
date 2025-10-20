"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getAllApplications = getAllApplications;
exports.getAllCompanies = getAllCompanies;
exports.platformSalaryTrends = platformSalaryTrends;
exports.platformReviewSalaryStats = platformReviewSalaryStats;
exports.platformJobCategories = platformJobCategories;
exports.platformApplicationStatusCounts = platformApplicationStatusCounts;
exports.platformTopCities = platformTopCities;
exports.platformDailyActiveUsers = platformDailyActiveUsers;
exports.platformMonthlyActiveUsers = platformMonthlyActiveUsers;
exports.platformSessionMetrics = platformSessionMetrics;
exports.platformPageViews = platformPageViews;
exports.platformConversionFunnelData = platformConversionFunnelData;
exports.platformRetentionData = platformRetentionData;
exports.platformPerformanceData = platformPerformanceData;
const prisma_1 = require("../../config/prisma");
async function getAllUsers(params) {
    const { from, to } = params;
    const where = {
        ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
    };
    return prisma_1.prisma.user.findMany({
        where,
        select: {
            id: true,
            gender: true,
            dob: true,
            city: true,
            createdAt: true,
            profile: { select: { gender: true, dob: true, city: true } },
        },
    });
}
async function getAllApplications(params) {
    const { from, to } = params;
    const where = {
        ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
    };
    return prisma_1.prisma.application.findMany({ where, include: { user: true, job: true } });
}
async function getAllCompanies() {
    return prisma_1.prisma.company.count();
}
async function platformSalaryTrends(params) {
    const { from, to } = params;
    const where = {
        expectedSalary: { not: null },
        ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
    };
    const items = await prisma_1.prisma.application.findMany({ where, include: { job: true } });
    const agg = new Map();
    for (const a of items) {
        const city = a.job.city || "Unknown";
        const title = a.job.title || "Unknown";
        const key = `${city}|${title}`;
        const expected = a.expectedSalary || 0;
        const cur = agg.get(key) || { city, title, sum: 0, n: 0 };
        cur.sum += expected;
        cur.n += 1;
        agg.set(key, cur);
    }
    return Array.from(agg.values()).map((v) => ({ city: v.city, title: v.title, avgExpectedSalary: v.n ? Math.round(v.sum / v.n) : 0, samples: v.n }));
}
async function platformReviewSalaryStats() {
    const reviews = await prisma_1.prisma.companyReview.findMany({ where: { salaryEstimateMin: { not: null }, salaryEstimateMax: { not: null } } });
    if (!reviews.length)
        return { avgSalaryEstimate: null, samples: 0 };
    const has = reviews.filter((r) => r.salaryEstimateMin != null && r.salaryEstimateMax != null);
    const avg = has.length ? Math.round(has.reduce((s, r) => s + Math.round(((r.salaryEstimateMin + r.salaryEstimateMax) / 2)), 0) / has.length) : null;
    return { avgSalaryEstimate: avg, samples: has.length };
}
async function platformJobCategories(params) {
    const { from, to } = params;
    const where = {
        ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
    };
    const items = await prisma_1.prisma.application.findMany({ where, include: { job: true } });
    const map = new Map();
    for (const a of items) {
        const cat = a.job.category;
        map.set(cat, (map.get(cat) || 0) + 1);
    }
    return Array.from(map.entries()).map(([category, count]) => ({ category, count }));
}
async function platformApplicationStatusCounts(params) {
    const { from, to } = params;
    const where = {
        ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
    };
    return prisma_1.prisma.application.groupBy({ by: ["status"], where, _count: { status: true } });
}
async function platformTopCities(params) {
    const { from, to } = params;
    const where = {
        ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
    };
    const items = await prisma_1.prisma.application.findMany({ where, include: { job: true } });
    const map = new Map();
    for (const a of items) {
        const city = a.job.city || "Unknown";
        map.set(city, (map.get(city) || 0) + 1);
    }
    return Array.from(map.entries()).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count);
}
async function platformDailyActiveUsers(params) {
    const { from, to } = params;
    const where = {
        ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
    };
    const uniqueUsers = await prisma_1.prisma.application.findMany({ where, select: { userId: true, createdAt: true }, distinct: ["userId"] });
    return { count: uniqueUsers.length, trend: 0 };
}
async function platformMonthlyActiveUsers(params) {
    const { from, to } = params;
    const where = {
        ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
    };
    const uniqueUsers = await prisma_1.prisma.application.findMany({ where, select: { userId: true }, distinct: ["userId"] });
    return { count: uniqueUsers.length, trend: 0 };
}
async function platformSessionMetrics(params) {
    return { averageSessionDuration: 300, bounceRate: 0.35, sessionsPerUser: 2.1 };
}
async function platformPageViews(params) {
    return { total: 0, unique: 0, topPages: [] };
}
async function platformConversionFunnelData(params) {
    const { from, to } = params;
    const where = {
        ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
    };
    const [totalApplications, interviews, accepted] = await Promise.all([
        prisma_1.prisma.application.count({ where }),
        prisma_1.prisma.application.count({ where: { ...where, status: 'INTERVIEW' } }),
        prisma_1.prisma.application.count({ where: { ...where, status: 'ACCEPTED' } }),
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
async function platformRetentionData(params) {
    return { day1: 0.85, day7: 0.65, day30: 0.45, cohorts: [] };
}
async function platformPerformanceData(params) {
    return { averageLoadTime: 1.2, errorRate: 0.02, uptime: 99.9, mobileVsDesktop: { mobile: 0.65, desktop: 0.35 } };
}
