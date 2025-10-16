"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedJobRepo = void 0;
const prisma_1 = require("../../config/prisma");
class SavedJobRepo {
    static async saveJob(userId, jobId) {
        const jid = typeof jobId === "string" ? Number(jobId) : jobId;
        return prisma_1.prisma.savedJob.upsert({
            where: {
                userId_jobId: {
                    userId,
                    jobId: jid,
                },
            },
            create: {
                userId,
                jobId: jid,
            },
            update: {}, // do nothing if it already exists
            include: {
                job: {
                    select: {
                        id: true,
                        title: true,
                        company: { select: { id: true, name: true, logoUrl: true } },
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
    static async getSavedJobsByUser(userId, page, limit) {
        const total = await prisma_1.prisma.savedJob.count({
            where: { userId },
        });
        const jobs = await prisma_1.prisma.savedJob.findMany({
            where: { userId },
            include: {
                job: {
                    select: {
                        id: true,
                        slug: true,
                        title: true,
                        company: { select: { id: true, name: true, logoUrl: true } },
                        city: true,
                        category: true,
                        salaryMin: true,
                        salaryMax: true,
                        tags: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { jobs, total };
    }
    static async unsaveJob(userId, jobId) {
        const jid = typeof jobId === "string" ? Number(jobId) : jobId;
        return prisma_1.prisma.savedJob.delete({
            where: { userId_jobId: { userId, jobId: jid } },
        });
    }
}
exports.SavedJobRepo = SavedJobRepo;
