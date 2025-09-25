"use strict";
// import { prisma } from "../../config/prisma";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRepo = void 0;
// export class ApplicationRepository {
//   static async createApplication(params: { userId: number; jobId: number; cvFile: string; expectedSalary?: number }) {
//     return prisma.application.create({
//       data: {
//         userId: params.userId,
//         jobId: params.jobId,
//         cvFile: params.cvFile,
//         expectedSalary: params.expectedSalary ?? null,
//       },
//     });
//   }
//   static async getPreselectionTestByJob(jobId: number) {
//     return prisma.preselectionTest.findUnique({ where: { jobId }, include: { results: true } });
//   }
//   static async getPreselectionResult(userId: number, testId: number) {
//     return prisma.preselectionResult.findUnique({ where: { userId_testId: { userId, testId } } });
//   }
//   static async getApplicationWithOwnership(applicationId: number) {
//     return prisma.application.findUnique({
//       where: { id: applicationId },
//       include: {
//         job: { include: { company: true } },
//         user: true,
//       },
//     });
//   }
//   static async updateApplicationStatus(applicationId: number, status: any, reviewNote?: string | null) {
//     return prisma.application.update({
//       where: { id: applicationId },
//       data: { status, reviewNote: reviewNote ?? null },
//     });
//   }
// }
const prisma_1 = require("../../config/prisma");
class ApplicationRepo {
    static async createApplication(data) {
        return prisma_1.prisma.application.create({ data });
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