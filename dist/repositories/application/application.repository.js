"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRepository = void 0;
const prisma_1 = require("../../config/prisma");
class ApplicationRepository {
    static async createApplication(params) {
        return prisma_1.prisma.application.create({
            data: {
                userId: params.userId,
                jobId: params.jobId,
                cvFile: params.cvFile,
                expectedSalary: params.expectedSalary ?? null,
            },
        });
    }
    static async getPreselectionTestByJob(jobId) {
        return prisma_1.prisma.preselectionTest.findUnique({ where: { jobId }, include: { results: true } });
    }
    static async getPreselectionResult(userId, testId) {
        return prisma_1.prisma.preselectionResult.findUnique({ where: { userId_testId: { userId, testId } } });
    }
    static async getApplicationWithOwnership(applicationId) {
        return prisma_1.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                job: { include: { company: true } },
                user: true,
            },
        });
    }
    static async updateApplicationStatus(applicationId, status, reviewNote) {
        return prisma_1.prisma.application.update({
            where: { id: applicationId },
            data: { status, reviewNote: reviewNote ?? null },
        });
    }
}
exports.ApplicationRepository = ApplicationRepository;
//# sourceMappingURL=application.repository.js.map