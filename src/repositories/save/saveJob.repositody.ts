import { prisma } from "../../config/prisma";

export class SavedJobRepo {
  public static async saveJob(userId: number, jobId: string | number) {
    const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
    return prisma.savedJob.create({
      data: {
        userId,
        jobId: jid,
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

  public static async getSavedJobsByUser(userId: number) {
    return prisma.savedJob.findMany({
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

  public static async unsaveJob(userId: number, jobId: string | number) {
    const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
    return prisma.savedJob.delete({
      where: { userId_jobId: { userId, jobId: jid } },
    });
  }
}
