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
    jobId: string,
    platform: SharePlatform,
    sharedUrl?: string,
    customMessage?: string
  ) {
    return prisma.jobShare.create({
      data: {
        userId,
        jobId,
        platform,
        ...(sharedUrl ? { sharedUrl } : {}),
        ...(customMessage ? { customMessage } : {}),
      },
    });
  }

  public static async findSharesByJob(jobId: string) {
    return prisma.jobShare.findMany({
      where: { jobId },
      include: {
        user: { select: { id: true, name: true } },
        job: { select: { id: true, title: true } },
      },
    });
  }
}
