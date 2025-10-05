import { prisma } from "../../config/prisma";

export class SavedJobRepo {
  public static async saveJob(userId: number, jobId: string | number) {
    const jid = typeof jobId === "string" ? Number(jobId) : jobId;

    return prisma.savedJob.upsert({
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

  public static async getSavedJobsByUser(
    userId: number,
    page: number,
    limit: number
  ) {
    const total = await prisma.savedJob.count({
      where: { userId },
    });

    const jobs = await prisma.savedJob.findMany({
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

  public static async unsaveJob(userId: number, jobId: string | number) {
    const jid = typeof jobId === "string" ? Number(jobId) : jobId;
    return prisma.savedJob.delete({
      where: { userId_jobId: { userId, jobId: jid } },
    });
  }
}
