import { JobShareRepo } from "../../repositories/share/shareJob.repository";
import { SharePlatform } from "../../repositories/share/shareJob.repository";

export class JobShareService {
  public static async shareJob(
    userId: number,
    jobId: string,
    platform: SharePlatform,
    sharedUrl?: string,
    customMessage?: string
  ) {
    return JobShareRepo.createShare(
      userId,
      jobId,
      platform,
      sharedUrl,
      customMessage
    );
  }

  public static async getSharesByJob(jobId: string) {
    return JobShareRepo.findSharesByJob(jobId);
  }
}
