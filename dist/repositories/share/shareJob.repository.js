"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobShareRepo = exports.SharePlatform = void 0;
const prisma_1 = require("../../config/prisma");
exports.SharePlatform = {
    WHATSAPP: "WHATSAPP",
    LINKEDIN: "LINKEDIN",
    FACEBOOK: "FACEBOOK",
    TWITTER: "TWITTER",
};
class JobShareRepo {
    static async createShare(userId, jobId, platform, sharedUrl, customMessage) {
        const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
        return prisma_1.prisma.jobShare.create({
            data: {
                userId,
                jobId: jid,
                platform,
                ...(sharedUrl ? { sharedUrl } : {}),
                ...(customMessage ? { customMessage } : {}),
            },
        });
    }
    static async findSharesByJob(jobId) {
        const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
        return prisma_1.prisma.jobShare.findMany({
            where: { jobId: jid },
            include: {
                user: { select: { id: true, name: true } },
                job: { select: { id: true, title: true } },
            },
        });
    }
}
exports.JobShareRepo = JobShareRepo;
//# sourceMappingURL=shareJob.repository.js.map