import { Request, Response, NextFunction } from "express";
import { JobShareService } from "../../services/share/jobShare.service";
import { SharePlatform } from "../../repositories/share/shareJob.repository";

type SharePlatformString = "whatsapp" | "linkedin" | "facebook" | "twitter";

const mapping: Record<SharePlatformString, SharePlatform> = {
  whatsapp: SharePlatform.WHATSAPP,
  linkedin: SharePlatform.LINKEDIN,
  facebook: SharePlatform.FACEBOOK,
  twitter: SharePlatform.TWITTER,
};

export class JobShareController {
  public static async shareJob(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = res.locals.decrypt.userId;
      const { jobId } = req.params;
      const { platform, sharedUrl, customMessage } = req.body;

      if (!jobId) {
        return res.status(400).json({ message: "Job ID is required" });
      }

      if (!platform || !mapping[platform as SharePlatformString]) {
        return res.status(400).json({ message: "Invalid platform" });
      }

      const share = await JobShareService.shareJob(
        userId,
        jobId as string,
        mapping[platform as SharePlatformString],
        sharedUrl ?? undefined,
        customMessage ?? undefined
      );

      res.status(201).json({
        message: "Job shared successfully",
        data: share,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getSharesByJob(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { jobId } = req.params;

      if (!jobId) {
        return res.status(400).json({ message: "Job ID is required" });
      }

      const shares = await JobShareService.getSharesByJob(jobId as string);

      res.status(200).json({
        message: "Shares fetched successfully",
        data: shares,
      });
    } catch (err) {
      next(err);
    }
  }
}
