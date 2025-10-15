"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeTemplateQueryRepository = void 0;
const prisma_1 = require("../../config/prisma");
class BadgeTemplateQueryRepository {
    // Get all badge templates
    static async getAllBadgeTemplates(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [templates, total] = await Promise.all([
            prisma_1.prisma.badgeTemplate.findMany({
                skip,
                take: limit,
                include: {
                    creator: {
                        select: { id: true, name: true },
                    },
                    _count: {
                        select: { assessments: true, userBadges: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma_1.prisma.badgeTemplate.count(),
        ]);
        return {
            templates,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    // Get badge template by ID
    static async getBadgeTemplateById(id) {
        return await prisma_1.prisma.badgeTemplate.findUnique({
            where: { id },
            include: {
                creator: {
                    select: { id: true, name: true, email: true },
                },
                assessments: {
                    select: { id: true, title: true },
                },
                _count: {
                    select: { assessments: true, userBadges: true },
                },
            },
        });
    }
    // Get developer's badge templates
    static async getDeveloperBadgeTemplates(createdBy) {
        return await prisma_1.prisma.badgeTemplate.findMany({
            where: { createdBy },
            include: {
                _count: {
                    select: { assessments: true, userBadges: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    // Search badge templates by category or name
    static async searchBadgeTemplates(query) {
        return await prisma_1.prisma.badgeTemplate.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { category: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
            include: {
                creator: {
                    select: { id: true, name: true },
                },
                _count: {
                    select: { assessments: true, userBadges: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    // Get badge template by name (for assessment creation)
    static async getBadgeTemplateByName(name) {
        return await prisma_1.prisma.badgeTemplate.findUnique({
            where: { name },
        });
    }
    // Get popular badge templates (most used)
    static async getPopularBadgeTemplates(limit = 10) {
        return await prisma_1.prisma.badgeTemplate.findMany({
            include: {
                creator: {
                    select: { id: true, name: true },
                },
                _count: {
                    select: { assessments: true, userBadges: true },
                },
            },
            orderBy: {
                userBadges: {
                    _count: "desc",
                },
            },
            take: limit,
        });
    }
    // Get badge templates by category
    static async getBadgeTemplatesByCategory(category) {
        return await prisma_1.prisma.badgeTemplate.findMany({
            where: { category },
            include: {
                creator: {
                    select: { id: true, name: true },
                },
                _count: {
                    select: { assessments: true, userBadges: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    // Find badge template by name
    static async findByName(name) {
        return await prisma_1.prisma.badgeTemplate.findFirst({
            where: { name },
        });
    }
    // Find badge template by name excluding specific ID
    static async findByNameExcluding(name, excludeId) {
        return await prisma_1.prisma.badgeTemplate.findFirst({
            where: {
                name,
                id: { not: excludeId },
            },
        });
    }
}
exports.BadgeTemplateQueryRepository = BadgeTemplateQueryRepository;
//# sourceMappingURL=badgeTemplateQuery.repository.js.map