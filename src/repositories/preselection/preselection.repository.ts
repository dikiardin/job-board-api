import { prisma } from "../../config/prisma";
import { Prisma } from "../../generated/prisma";

export class PreselectionRepository {
  static async getJob(jobId: string) {
    return prisma.job.findUnique({ where: { id: jobId }, include: { company: true } });
  }

  static async getTestByJobId(jobId: string) {
    return prisma.preselectionTest.findUnique({
      where: { jobId },
      include: { questions: true },
    });
  }

  static async getTestById(testId: number) {
    return prisma.preselectionTest.findUnique({
      where: { id: testId },
      include: { questions: true, job: { include: { company: true } } },
    });
  }

  static async createTest(jobId: string, questions: Array<{ question: string; options: string[]; answer: string }>, passingScore?: number, isActive: boolean = true) {
    return prisma.preselectionTest.create({
      data: {
        jobId,
        isActive,
        passingScore: passingScore ?? null,
        questions: {
          create: questions.map((q) => ({ question: q.question, options: q.options as unknown as Prisma.InputJsonValue, answer: q.answer })),
        },
      },
      include: { questions: true },
    });
  }

  static async deleteTestByJobId(jobId: string) {
    return prisma.preselectionTest.delete({ where: { jobId } });
  }

  static async upsertTest(jobId: string, questions: Array<{ question: string; options: string[]; answer: string }>, passingScore?: number, isActive: boolean = true) {
    const existing = await this.getTestByJobId(jobId);
    if (existing) {
      // Replace questions entirely
      await prisma.preselectionQuestion.deleteMany({ where: { testId: existing.id } });
      return prisma.preselectionTest.update({
        where: { jobId },
        data: {
          isActive,
          passingScore: passingScore ?? null,
          questions: {
            create: questions.map((q) => ({ question: q.question, options: q.options as unknown as Prisma.InputJsonValue, answer: q.answer })),
          },
        },
        include: { questions: true },
      });
    }
    return this.createTest(jobId, questions, passingScore, isActive);
  }

  static async getResult(userId: number, testId: number) {
    return prisma.preselectionResult.findUnique({ where: { userId_testId: { userId, testId } }, include: { answers: true } });
  }

  static async createResult(userId: number, testId: number, score: number, answers: Array<{ questionId: number; selected: string; isCorrect: boolean }>) {
    return prisma.preselectionResult.create({
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

  static async getTestResultsByJob(jobId: string) {
    return prisma.preselectionTest.findUnique({
      where: { jobId },
      include: {
        results: { include: { user: true, answers: true } },
        questions: true,
        job: true,
      },
    });
  }

  static async getResultsByTestAndUsers(testId: number, userIds: number[]) {
    if (!userIds.length) return [] as any[];
    return prisma.preselectionResult.findMany({
      where: { testId, userId: { in: userIds } },
      select: { id: true, userId: true, testId: true, score: true, createdAt: true },
    });
  }
}
