"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillAssessmentResultsCertificateRepository = void 0;
const prisma_1 = require("../../config/prisma");
class SkillAssessmentResultsCertificateRepository {
    // Verify certificate by code
    static async verifyCertificate(certificateCode) {
        return await prisma_1.prisma.skillResult.findFirst({
            where: { certificateCode },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                assessment: {
                    select: { id: true, title: true, description: true },
                },
            },
        });
    }
    // Get user's certificates
    static async getUserCertificates(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [certificates, total] = await Promise.all([
            prisma_1.prisma.skillResult.findMany({
                where: {
                    userId,
                    certificateCode: { not: null },
                },
                skip,
                take: limit,
                include: {
                    assessment: {
                        select: { id: true, title: true, description: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma_1.prisma.skillResult.count({
                where: {
                    userId,
                    certificateCode: { not: null },
                },
            }),
        ]);
        return {
            certificates,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    // Get certificate by code
    static async getCertificateByCode(certificateCode) {
        return await prisma_1.prisma.skillResult.findFirst({
            where: { certificateCode },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                assessment: {
                    select: { id: true, title: true, description: true },
                },
            },
        });
    }
}
exports.SkillAssessmentResultsCertificateRepository = SkillAssessmentResultsCertificateRepository;
