"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvRepository = exports.CVRepository = void 0;
const prisma_1 = require("../../../config/prisma");
class CVRepository {
    // Create new CV record
    async create(data) {
        return await prisma_1.prisma.generatedCV.create({
            data: {
                userId: data.userId,
                fileUrl: data.fileUrl,
                templateUsed: data.templateUsed,
                additionalInfo: data.additionalInfo,
            },
        });
    }
    // Find CV by ID
    async findById(id) {
        return await prisma_1.prisma.generatedCV.findUnique({
            where: { id },
        });
    }
    // Find CV by ID with user data
    async findByIdWithUser(id) {
        return await prisma_1.prisma.generatedCV.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        address: true,
                        profilePicture: true,
                    },
                },
            },
        });
    }
    // Find CV by ID and user ID (for security)
    async findByIdAndUserId(id, userId) {
        return await prisma_1.prisma.generatedCV.findFirst({
            where: {
                id,
                userId,
            },
        });
    }
    // Find all CVs by user ID
    async findByUserId(userId) {
        return await prisma_1.prisma.generatedCV.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                fileUrl: true,
                templateUsed: true,
                createdAt: true,
            },
        });
    }
    // Find all CVs by user ID with full data
    async findByUserIdWithDetails(userId) {
        return await prisma_1.prisma.generatedCV.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    // Update CV by ID
    async updateById(id, data) {
        return await prisma_1.prisma.generatedCV.update({
            where: { id },
            data: {
                ...(data.fileUrl && { fileUrl: data.fileUrl }),
                ...(data.templateUsed && { templateUsed: data.templateUsed }),
                ...(data.additionalInfo && { additionalInfo: data.additionalInfo }),
            },
        });
    }
    // Delete CV by ID
    async deleteById(id) {
        return await prisma_1.prisma.generatedCV.delete({
            where: { id },
        });
    }
    // Delete CV by ID and user ID (for security)
    async deleteByIdAndUserId(id, userId) {
        const cv = await this.findByIdAndUserId(id, userId);
        if (!cv) {
            return null;
        }
        return await prisma_1.prisma.generatedCV.delete({
            where: { id },
        });
    }
    // Count CVs by user ID
    async countByUserId(userId) {
        return await prisma_1.prisma.generatedCV.count({
            where: { userId },
        });
    }
    // Count CVs by user ID in current month (for subscription limits)
    async countByUserIdThisMonth(userId) {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        return await prisma_1.prisma.generatedCV.count({
            where: {
                userId,
                createdAt: {
                    gte: startOfMonth,
                },
            },
        });
    }
    // Find CVs by template type
    async findByTemplateType(templateType) {
        return await prisma_1.prisma.generatedCV.findMany({
            where: { templateUsed: templateType },
            orderBy: { createdAt: 'desc' },
        });
    }
    // Find recent CVs (for analytics)
    async findRecent(limit = 10) {
        return await prisma_1.prisma.generatedCV.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
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
    // Check if CV exists
    async exists(id) {
        const cv = await prisma_1.prisma.generatedCV.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!cv;
    }
    // Check if user owns CV
    async isOwner(cvId, userId) {
        const cv = await prisma_1.prisma.generatedCV.findFirst({
            where: {
                id: cvId,
                userId,
            },
            select: { id: true },
        });
        return !!cv;
    }
}
exports.CVRepository = CVRepository;
exports.cvRepository = new CVRepository();
//# sourceMappingURL=cv.repository.js.map