"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRepository = void 0;
const prisma_1 = require("../../config/prisma");
class AnalyticsRepository {
    static async getCompany(companyId) {
        const id = typeof companyId === 'string' ? Number(companyId) : companyId;
        return prisma_1.prisma.company.findUnique({ where: { id } });
    }
    static async getCompanyApplications(params) {
        const { companyId, from, to } = params;
        const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
        const where = {
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
        return prisma_1.prisma.application.findMany({
            where,
            include: { user: true, job: true },
        });
    }
    static async applicationStatusCounts(params) {
        const { companyId, from, to } = params;
        const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
        const where = {
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
        const grouped = await prisma_1.prisma.application.groupBy({
            by: ["status"],
            where,
            _count: { status: true },
        });
        return grouped;
    }
    static async applicationsByCategory(params) {
        const { companyId, from, to } = params;
        const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
        const where = {
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
        const items = await prisma_1.prisma.application.findMany({ where, include: { job: true } });
        const map = new Map();
        for (const a of items) {
            const cat = a.job.category;
            map.set(cat, (map.get(cat) || 0) + 1);
        }
        return Array.from(map.entries()).map(([category, count]) => ({ category, count }));
    }
    static async expectedSalaryByCityAndTitle(params) {
        const { companyId, from, to } = params;
        const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
        const where = {
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
    static async topCitiesByApplications(params) {
        const { companyId, from, to } = params;
        const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
        const where = {
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
        const items = await prisma_1.prisma.application.findMany({ where, include: { job: true } });
        const map = new Map();
        for (const a of items) {
            const city = a.job.city || "Unknown";
            map.set(city, (map.get(city) || 0) + 1);
        }
        return Array.from(map.entries()).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count);
    }
    static async companyReviewSalaryStats(companyId) {
        const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
        // Reviews linked via Employment -> CompanyReview
        const reviews = await prisma_1.prisma.companyReview.findMany({
            where: { employment: { companyId: cid } },
        });
        if (!reviews.length)
            return { avgSalaryEstimate: null, samples: 0 };
        const has = reviews.filter((r) => r.salaryEstimate != null);
        const avg = has.length ? Math.round(has.reduce((s, r) => s + r.salaryEstimate, 0) / has.length) : null;
        return { avgSalaryEstimate: avg, samples: has.length };
    }
}
exports.AnalyticsRepository = AnalyticsRepository;
//# sourceMappingURL=analytics.repository.js.map