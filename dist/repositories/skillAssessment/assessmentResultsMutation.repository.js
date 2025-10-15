"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentResultsMutationRepository = void 0;
const prisma_1 = require("../../config/prisma");
class AssessmentResultsMutationRepository {
    // Save assessment result
    static async saveAssessmentResult(data) {
        return await prisma_1.prisma.skillResult.create({
            data: {
                userId: data.userId,
                assessmentId: data.assessmentId,
                score: data.score,
                isPassed: data.isPassed,
                certificateUrl: data.certificateUrl || null,
                certificateCode: data.certificateCode || null,
                startedAt: new Date(),
                finishedAt: new Date(),
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                assessment: { select: { id: true, title: true, description: true } },
            },
        });
    }
    // Delete assessment result
    static async deleteAssessmentResult(resultId) {
        return await prisma_1.prisma.skillResult.delete({
            where: { id: resultId },
        });
    }
    // Update certificate info
    static async updateCertificateInfo(resultId, certificateUrl, certificateCode) {
        return await prisma_1.prisma.skillResult.update({
            where: { id: resultId },
            data: { certificateUrl, certificateCode },
        });
    }
}
exports.AssessmentResultsMutationRepository = AssessmentResultsMutationRepository;
//# sourceMappingURL=assessmentResultsMutation.repository.js.map