"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedJobRepo = void 0;
const prisma_1 = require("../../config/prisma");
class SavedJobRepo {
    static async saveJob(userId, jobId) {
        return prisma_1.prisma.savedJob.create({
            data: {
                userId,
                jobId,
            },
            include: {
                job: {
                    select: {
                        id: true,
                        title: true,
                        company: {
                            select: { id: true, name: true, logo: true },
                        },
                        city: true,
                        category: true,
                        salaryMin: true,
                        salaryMax: true,
                        tags: true,
                    },
                },
            },
        });
    }
    static async getSavedJobsByUser(userId) {
        return prisma_1.prisma.savedJob.findMany({
            where: { userId },
            include: {
                job: {
                    select: {
                        id: true,
                        title: true,
                        company: {
                            select: { id: true, name: true, logo: true },
                        },
                        city: true,
                        category: true,
                        salaryMin: true,
                        salaryMax: true,
                        tags: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    static async unsaveJob(userId, jobId) {
        return prisma_1.prisma.savedJob.delete({
            where: { userId_jobId: { userId, jobId } },
        });
    }
}
exports.SavedJobRepo = SavedJobRepo;
//# sourceMappingURL=saveJob.repositody.js.map