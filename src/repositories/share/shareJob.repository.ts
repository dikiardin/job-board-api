import { prisma } from "../../config/prisma";

export const SharePlatform = {
  WHATSAPP: "WHATSAPP",
  LINKEDIN: "LINKEDIN",
  FACEBOOK: "FACEBOOK",
  TWITTER: "TWITTER",
} as const;

export type SharePlatform = (typeof SharePlatform)[keyof typeof SharePlatform];

export class JobShareRepo {
  public static async createShare(
    userId: number,
    jobId: string | number,
    platform: SharePlatform,
    sharedUrl?: string,
    customMessage?: string
  ) {
    const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
    return prisma.jobShare.create({
      data: {
        userId,
        jobId: jid,
        platform,
        ...(sharedUrl ? { sharedUrl } : {}),
        ...(customMessage ? { customMessage } : {}),
      },
    });
  }

  public static async findSharesByJob(jobId: string | number) {
    const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
    return prisma.jobShare.findMany({
      where: { jobId: jid },
      include: {
        user: { select: { id: true, name: true } },
        job: { select: { id: true, title: true } },
      },
    });
  }
}
