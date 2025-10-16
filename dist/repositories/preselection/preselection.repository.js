"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreselectionRepository = void 0;
const prisma_1 = require("../../config/prisma");
class PreselectionRepository {
    static async getJob(jobId) {
        const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
        return prisma_1.prisma.job.findUnique({ where: { id: jid }, include: { company: true } });
    }
    static async getTestByJobId(jobId) {
        const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
        return prisma_1.prisma.preselectionTest.findUnique({
            where: { jobId: jid },
            include: { questions: true },
        });
    }
    static async getTestById(testId) {
        return prisma_1.prisma.preselectionTest.findUnique({
            where: { id: testId },
            include: { questions: true, job: { include: { company: true } } },
        });
    }
    static async createTest(jobId, questions, passingScore, isActive = true) {
        const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
        return prisma_1.prisma.preselectionTest.create({
            data: {
                jobId: jid,
                isActive,
                passingScore: passingScore ?? null,
                questions: {
                    create: questions.map((q) => ({ question: q.question, options: q.options, answer: q.answer })),
                },
            },
            include: { questions: true },
        });
    }
    static async deleteTestByJobId(jobId) {
        const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
        return prisma_1.prisma.preselectionTest.delete({ where: { jobId: jid } });
    }
    static async upsertTest(jobId, questions, passingScore, isActive = true) {
        const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
        const existing = await PreselectionRepository.getTestByJobId(jid);
        if (existing) {
            // Replace questions entirely
            await prisma_1.prisma.preselectionQuestion.deleteMany({ where: { testId: existing.id } });
            return prisma_1.prisma.preselectionTest.update({
                where: { jobId: jid },
                data: {
                    isActive,
                    passingScore: passingScore ?? null,
                    questions: {
                        create: questions.map((q) => ({ question: q.question, options: q.options, answer: q.answer })),
                    },
                },
                include: { questions: true },
            });
        }
        return PreselectionRepository.createTest(jid, questions, passingScore, isActive);
    }
    static async getResult(userId, testId) {
        return prisma_1.prisma.preselectionResult.findUnique({ where: { userId_testId: { userId, testId } }, include: { answers: true } });
    }
    static async createResult(userId, testId, score, answers) {
        return prisma_1.prisma.preselectionResult.create({
            data: {
                userId,
                testId,
                score,
                answers: {
                    create: answers,
                },
            },
            include: { answers: true },
        });
    }
    static async getTestResultsByJob(jobId) {
        const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
        return prisma_1.prisma.preselectionTest.findUnique({
            where: { jobId: jid },
            include: {
                results: { include: { user: true, answers: true } },
                questions: true,
                job: true,
            },
        });
    }
    static async getResultsByTestAndUsers(testId, userIds) {
        if (!userIds.length)
            return [];
        return prisma_1.prisma.preselectionResult.findMany({
            where: { testId, userId: { in: userIds } },
            select: { id: true, userId: true, testId: true, score: true, createdAt: true },
        });
    }
}
exports.PreselectionRepository = PreselectionRepository;
