import { Request, Response, NextFunction } from "express";
import { ApplicationService } from "../../services/application/application.service";
import { CustomError } from "../../utils/customError";

export class ApplicationController {
  public static async applyJob(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = res.locals.decrypt.userId;
      const jobSlug = req.params.jobSlug;

      if (!jobSlug) {
        throw new CustomError("Job slug is required", 400);
      }

      const { expectedSalary } = req.body;

      if (!req.file) {
        throw new CustomError("CV file is required", 400);
      }

      const application = await ApplicationService.submitApplicationBySlug(
        userId,
        jobSlug,
        req.file,
        expectedSalary ? parseInt(expectedSalary) : undefined
      );

      res.status(201).json({
        message: "Application submitted successfully",
        application,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getApplicationsByUserId(
    req: Request<
      { userId: string },
      any,
      any,
      { page?: string; limit?: string }
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user id" });
      }

      const page = parseInt(req.query.page || "1", 10);
      const limit = parseInt(req.query.limit || "10", 10);

      const { applications, total } =
        await ApplicationService.getApplicationsByUserId(userId, page, limit);

      res.status(200).json({
        message: "Applications fetched successfully",
        data: applications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  }
}
