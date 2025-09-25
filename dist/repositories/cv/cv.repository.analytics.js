"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvRepositoryAnalytics = exports.CVRepositoryAnalytics = void 0;
const prisma_1 = require("../../config/prisma");
class CVRepositoryAnalytics {
    // Get CV statistics
    async getStatistics() {
        const totalCVs = await prisma_1.prisma.generatedCV.count();
        const totalUsers = await prisma_1.prisma.generatedCV.groupBy({
            by: ['userId'],
            _count: {
                userId: true,
            },
        }).then(result => result.length);
        const templateStats = await prisma_1.prisma.generatedCV.groupBy({
            by: ['templateUsed'],
            _count: {
                templateUsed: true,
            },
        }).then(result => result.map(item => ({
            templateUsed: item.templateUsed,
            count: item._count.templateUsed,
        })));
        // Get monthly stats for last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlyData = await prisma_1.prisma.generatedCV.findMany({
            where: {
                createdAt: {
                    gte: sixMonthsAgo,
                },
            },
            select: {
                createdAt: true,
            },
        });
        const monthlyStats = monthlyData.reduce((acc, cv) => {
            const month = cv.createdAt.toISOString().substring(0, 7); // YYYY-MM format
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});
        return {
            totalCVs,
            totalUsers,
            templateStats,
            monthlyStats: Object.entries(monthlyStats).map(([month, count]) => ({
                month,
                count,
            })),
        };
    }
    // Get template usage statistics
    async getTemplateStats() {
        return await prisma_1.prisma.generatedCV.groupBy({
            by: ['templateUsed'],
            _count: {
                templateUsed: true,
            },
        }).then(result => result.map(item => ({
            templateUsed: item.templateUsed,
            count: item._count.templateUsed,
        })));
    }
    // Get monthly CV generation stats
    async getMonthlyStats(months = 6) {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);
        const monthlyData = await prisma_1.prisma.generatedCV.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                },
            },
            select: {
                createdAt: true,
            },
        });
        const monthlyStats = monthlyData.reduce((acc, cv) => {
            const month = cv.createdAt.toISOString().substring(0, 7); // YYYY-MM format
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(monthlyStats)
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => a.month.localeCompare(b.month));
    }
    // Get user engagement stats
    async getUserEngagementStats() {
        const userStats = await prisma_1.prisma.generatedCV.groupBy({
            by: ['userId'],
            _count: {
                userId: true,
            },
            orderBy: {
                _count: {
                    userId: 'desc',
                },
            },
            take: 10,
        });
        const activeUsers = userStats.length;
        const totalCVs = userStats.reduce((sum, user) => sum + user._count.userId, 0);
        const averageCVsPerUser = activeUsers > 0 ? totalCVs / activeUsers : 0;
        // Get user names for top users
        const topUserIds = userStats.slice(0, 5).map(stat => stat.userId);
        const userNames = await prisma_1.prisma.user.findMany({
            where: {
                id: {
                    in: topUserIds,
                },
            },
            select: {
                id: true,
                name: true,
            },
        });
        const topUsers = userStats.slice(0, 5).map(stat => {
            const user = userNames.find(u => u.id === stat.userId);
            return {
                userId: stat.userId,
                cvCount: stat._count.userId,
                ...(user?.name && { userName: user.name }),
            };
        });
        return {
            activeUsers,
            averageCVsPerUser: Math.round(averageCVsPerUser * 100) / 100,
            topUsers,
        };
    }
}
exports.CVRepositoryAnalytics = CVRepositoryAnalytics;
exports.cvRepositoryAnalytics = new CVRepositoryAnalytics();
//# sourceMappingURL=cv.repository.analytics.js.map