"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvRepositoryBase = exports.CVRepositoryBase = void 0;
const prisma_1 = require("../../config/prisma");
class CVRepositoryBase {
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
exports.CVRepositoryBase = CVRepositoryBase;
exports.cvRepositoryBase = new CVRepositoryBase();
//# sourceMappingURL=cv.repository.base.js.map