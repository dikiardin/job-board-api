"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewRepository = void 0;
const prisma_1 = require("../../config/prisma");
const prisma_2 = require("../../generated/prisma");
class InterviewRepository {
    static async createMany(interviews) {
        return prisma_1.prisma.$transaction(async (tx) => {
            const created = [];
            for (const item of interviews) {
                const rec = await tx.interview.create({
                    data: {
                        applicationId: item.applicationId,
                        scheduleDate: item.scheduleDate,
                        locationOrLink: item.locationOrLink ?? null,
                        notes: item.notes ?? null,
                    },
                    include: {
                        application: {
                            include: {
                                user: true,
                                job: { include: { company: { include: { admin: true } } } },
                            },
                        },
                    },
                });
                created.push(rec);
            }
            return created;
        });
    }
    static async createOne(data) {
        return prisma_1.prisma.interview.create({
            data: {
                applicationId: data.applicationId,
                scheduleDate: data.scheduleDate,
                locationOrLink: data.locationOrLink ?? null,
                notes: data.notes ?? null,
            },
            include: {
                application: {
                    include: {
                        user: true,
                        job: { include: { company: { include: { admin: true } } } },
                    },
                },
            },
        });
    }
    static async updateOne(id, data) {
        return prisma_1.prisma.interview.update({
            where: { id },
            data,
            include: {
                application: {
                    include: {
                        user: true,
                        job: { include: { company: { include: { admin: true } } } },
                    },
                },
            },
        });
    }
    static async deleteOne(id) {
        return prisma_1.prisma.interview.delete({ where: { id } });
    }
    static async getById(id) {
        return prisma_1.prisma.interview.findUnique({
            where: { id },
            include: {
                application: {
                    include: {
                        user: true,
                        job: { include: { company: { include: { admin: true } } } },
                    },
                },
            },
        });
    }
    static async list(params) {
        const { companyId, jobId, applicantId, status, dateFrom, dateTo, limit = 10, offset = 0 } = params;
        const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
        const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
        const where = {
            application: {
                job: {
                    companyId: cid,
                    ...(jid ? { id: jid } : {}),
                },
                ...(applicantId ? { userId: applicantId } : {}),
            },
            ...(status ? { status } : {}),
            ...(dateFrom || dateTo
                ? {
                    scheduleDate: {
                        ...(dateFrom ? { gte: dateFrom } : {}),
                        ...(dateTo ? { lte: dateTo } : {}),
                    },
                }
                : {}),
        };
        const [items, total] = await Promise.all([
            prisma_1.prisma.interview.findMany({
                where,
                orderBy: { scheduleDate: "asc" },
                skip: offset,
                take: limit,
                include: {
                    application: {
                        include: { user: true, job: { include: { company: { include: { admin: true } } } } },
                    },
                },
            }),
            prisma_1.prisma.interview.count({ where }),
        ]);
        return { items, total, limit, offset };
    }
    static async findConflicts(applicationId, start, end) {
        return prisma_1.prisma.interview.findFirst({
            where: {
                applicationId,
                status: { in: [prisma_2.InterviewStatus.SCHEDULED, prisma_2.InterviewStatus.COMPLETED] },
                scheduleDate: { gte: start, lte: end },
            },
        });
    }
    static async getDueReminders(windowStart, windowEnd) {
        return prisma_1.prisma.interview.findMany({
            where: {
                status: prisma_2.InterviewStatus.SCHEDULED,
                reminderSentAt: null,
                scheduleDate: { gte: windowStart, lt: windowEnd },
            },
            include: {
                application: {
                    include: { user: true, job: { include: { company: { include: { admin: true } } } } },
                },
            },
        });
    }
    static async markReminderSent(id) {
        return prisma_1.prisma.interview.update({ where: { id }, data: { reminderSentAt: new Date() } });
    }
}
exports.InterviewRepository = InterviewRepository;
//# sourceMappingURL=interview.repository.js.map