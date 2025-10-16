"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CVRepo = void 0;
const prisma_1 = require("../../config/prisma");
class CVRepo {
    // Create new CV record
    static async create(data) {
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
    static async findById(id) {
        return await prisma_1.prisma.generatedCV.findUnique({
            where: { id },
        });
    }
    // Find CV by ID with user data
    static async findByIdWithUser(id) {
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
    static async findByIdAndUserId(id, userId) {
        return await prisma_1.prisma.generatedCV.findFirst({
            where: {
                id,
                userId,
            },
        });
    }
    // Find all CVs by user ID
    static async findByUserId(userId) {
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
    static async findByUserIdWithDetails(userId) {
        return await prisma_1.prisma.generatedCV.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    // Update CV by ID
    static async updateById(id, data) {
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
    static async deleteById(id) {
        return await prisma_1.prisma.generatedCV.delete({
            where: { id },
        });
    }
    // Delete CV by ID and user ID (for security)
    static async deleteByIdAndUserId(id, userId) {
        const cv = await CVRepo.findByIdAndUserId(id, userId);
        if (!cv) {
            return null;
        }
        return await prisma_1.prisma.generatedCV.delete({
            where: { id },
        });
    }
    // Count CVs by user ID
    static async countByUserId(userId) {
        return await prisma_1.prisma.generatedCV.count({
            where: { userId },
        });
    }
    // Count CVs by user ID in current month (for subscription limits)
    static async countByUserIdThisMonth(userId) {
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
    static async findByTemplateType(templateType) {
        return await prisma_1.prisma.generatedCV.findMany({
            where: { templateUsed: templateType },
            orderBy: { createdAt: 'desc' },
        });
    }
    // Find recent CVs (for analytics)
    static async findRecent(limit = 10) {
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
    // Check if CV exists
    static async exists(id) {
        const cv = await prisma_1.prisma.generatedCV.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!cv;
    }
    // Check if user owns CV
    static async isOwner(cvId, userId) {
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
exports.CVRepo = CVRepo;
