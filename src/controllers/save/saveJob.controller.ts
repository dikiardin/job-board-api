import { Request, Response, NextFunction } from "express";
import { SavedJobService } from "../../services/save/saveJob.service";

export class SavedJobController {
  public static async saveJob(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.decrypt.userId;
      const { jobId } = req.params;

      if (!jobId) {
        return res.status(400).json({ message: "Job ID is required" });
      }

      const savedJob = await SavedJobService.saveJob(userId, jobId as string);
      res.status(201).json({
        message: "Job saved successfully",
        data: savedJob,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getSavedJobsByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const jobs = await SavedJobService.getSavedJobsByUser(
        parseInt(userId, 10)
      );
      res.status(200).json({
        message: "Saved jobs fetched successfully",
        data: jobs,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async unsaveJob(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = res.locals.decrypt.userId;
      const { jobId } = req.params;

      if (!jobId) {
        return res.status(400).json({ message: "Job ID is required" });
      }

      await SavedJobService.unsaveJob(userId, jobId as string);
      res.status(200).json({ message: "Job unsaved successfully" });
    } catch (err) {
      next(err);
    }
  }
}
