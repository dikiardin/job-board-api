"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRepo = void 0;
const prisma_1 = require("../../config/prisma");
class ApplicationRepo {
    static async createApplication(data) {
        return prisma_1.prisma.application.create({
            data: {
                userId: data.userId,
                jobId: data.jobId,
                cvFile: data.cvFile,
                expectedSalary: typeof data.expectedSalary === "number" ? data.expectedSalary : null,
            },
        });
    }
    static async findExisting(userId, jobId) {
        return prisma_1.prisma.application.findFirst({
            where: { userId, jobId },
        });
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
exports.ApplicationRepo = ApplicationRepo;
//# sourceMappingURL=application.repository.js.map