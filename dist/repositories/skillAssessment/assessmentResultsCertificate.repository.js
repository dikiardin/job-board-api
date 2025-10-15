"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentResultsCertificateRepository = void 0;
const prisma_1 = require("../../config/prisma");
class AssessmentResultsCertificateRepository {
    // Verify certificate by code
    static async verifyCertificate(certificateCode) {
        return await prisma_1.prisma.skillResult.findFirst({
            where: {
                certificateCode,
                isPassed: true, // Only return passed certificates
                certificateUrl: { not: null }, // Only return certificates with URL
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                assessment: {
                    select: { id: true, title: true, description: true, category: true },
                },
            },
        });
    }
    // Get user's certificates
    static async getUserCertificates(userId, page, limit) {
        const query = {
            where: { userId, certificateCode: { not: null } },
            include: {
                assessment: { select: { id: true, title: true, description: true } },
            },
            orderBy: { createdAt: "desc" },
        };
        if (page && limit) {
            query.skip = (page - 1) * limit;
            query.take = limit;
        }
        const [certificates, total] = await Promise.all([
            prisma_1.prisma.skillResult.findMany(query),
            prisma_1.prisma.skillResult.count({
                where: { userId, certificateCode: { not: null } },
            }),
        ]);
        return {
            certificates,
            pagination: page && limit
                ? { page, limit, total, totalPages: Math.ceil(total / limit) }
                : null,
        };
    }
    // Get certificate by code
    static async getCertificateByCode(certificateCode) {
        return await prisma_1.prisma.skillResult.findFirst({
            where: { certificateCode },
            include: {
                user: { select: { id: true, name: true, email: true } },
                assessment: { select: { id: true, title: true, description: true } },
            },
        });
    }
}
exports.AssessmentResultsCertificateRepository = AssessmentResultsCertificateRepository;
//# sourceMappingURL=assessmentResultsCertificate.repository.js.map