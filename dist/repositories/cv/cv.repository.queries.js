"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvRepositoryQueries = exports.CVRepositoryQueries = void 0;
const prisma_1 = require("../../config/prisma");
class CVRepositoryQueries {
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
}
exports.CVRepositoryQueries = CVRepositoryQueries;
exports.cvRepositoryQueries = new CVRepositoryQueries();
//# sourceMappingURL=cv.repository.queries.js.map