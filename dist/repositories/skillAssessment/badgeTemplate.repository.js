"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeTemplateRepository = void 0;
const prisma_1 = require("../../config/prisma");
class BadgeTemplateRepository {
    // Create badge template (Developer only)
    static async createBadgeTemplate(data) {
        return await prisma_1.prisma.badgeTemplate.create({
            data: {
                name: data.name,
                icon: data.icon || null,
                description: data.description || null,
                category: data.category || null,
                createdBy: data.createdBy,
            },
            include: {
                creator: {
                    select: { id: true, name: true, email: true },
                },
                _count: {
                    select: { assessments: true, userBadges: true },
                },
            },
        });
    }
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
    // Update badge template
    static async updateBadgeTemplate(id, createdBy, data) {
        console.log('Repository update - ID:', id, 'CreatedBy:', createdBy, 'Data:', data);
        // First check if template exists and who created it
        const existingTemplate = await prisma_1.prisma.badgeTemplate.findUnique({
            where: { id },
            select: { id: true, createdBy: true, name: true }
        });
        console.log('Existing template:', existingTemplate);
        if (!existingTemplate) {
            console.log('Template not found');
            return { count: 0 };
        }
        if (existingTemplate.createdBy !== createdBy) {
            console.log('Permission denied - different creator');
            return { count: 0 };
        }
        const result = await prisma_1.prisma.badgeTemplate.updateMany({
            where: { id, createdBy },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.icon !== undefined && { icon: data.icon || null }),
                ...(data.description !== undefined && { description: data.description || null }),
                ...(data.category !== undefined && { category: data.category || null }),
            },
        });
        console.log('Update result from Prisma:', result);
        return result;
    }
    // Delete badge template
    static async deleteBadgeTemplate(id, createdBy) {
        // Check if template is being used by assessments
        const template = await prisma_1.prisma.badgeTemplate.findFirst({
            where: { id, createdBy },
            include: {
                _count: { select: { assessments: true } },
            },
        });
        if (!template) {
            return { count: 0, error: "Template not found or no permission" };
        }
        if (template._count.assessments > 0) {
            return { count: 0, error: "Cannot delete template that is being used by assessments" };
        }
        const result = await prisma_1.prisma.badgeTemplate.deleteMany({
            where: { id, createdBy },
        });
        return { count: result.count };
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
    // Check if badge template name exists
    static async checkBadgeTemplateNameExists(name, excludeId) {
        const where = { name };
        if (excludeId) {
            where.id = { not: excludeId };
        }
        const existing = await prisma_1.prisma.badgeTemplate.findFirst({ where });
        return !!existing;
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
    // Check if badge template is in use
    static async isBadgeTemplateInUse(id) {
        const [assessmentCount, badgeCount] = await Promise.all([
            prisma_1.prisma.skillAssessment.count({ where: { badgeTemplateId: id } }),
            prisma_1.prisma.userBadge.count({ where: { badgeTemplateId: id } }),
        ]);
        return assessmentCount > 0 || badgeCount > 0;
    }
    // Get badge template statistics
    static async getBadgeTemplateStats() {
        const [total, totalAwarded, totalAssessments] = await Promise.all([
            prisma_1.prisma.badgeTemplate.count(),
            prisma_1.prisma.userBadge.count(),
            prisma_1.prisma.skillAssessment.count({ where: { badgeTemplateId: { not: null } } }),
        ]);
        return {
            totalTemplates: total,
            totalBadgesAwarded: totalAwarded,
            totalAssessmentsWithBadges: totalAssessments,
        };
    }
}
exports.BadgeTemplateRepository = BadgeTemplateRepository;
//# sourceMappingURL=badgeTemplate.repository.js.map