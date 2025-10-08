import { NextFunction, Request, Response } from "express";
import { GetJobService } from "../../services/job/job.get.service";

export class GetJobController {
  public static async getAllJobs(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        keyword,
        city,
        limit = "9",
        page = "1",
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const numericLimit = parseInt(limit as string, 10);
      const numericPage = parseInt(page as string, 10);
      const offset = (numericPage - 1) * numericLimit;

      const { jobs, total } = await GetJobService.getAllJobs({
        keyword: keyword as string,
        city: city as string,
        limit: numericLimit,
        offset,
        sortBy: sortBy as "createdAt", 
        sortOrder: (sortOrder as "asc" | "desc") || "desc",
      });

      res.status(200).json({
        message: "Jobs fetched successfully",
        data: jobs,
        total,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getJobBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { slug } = req.params;

      if (!slug) {
        return res.status(400).json({ message: "Job slug is required" });
      }

      const job = await GetJobService.getJobBySlug(slug);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.status(200).json({
        message: "Job fetched successfully",
        data: job,
      });
    } catch (err) {
      next(err);
    }
  }
}
