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
      const jobIdParam = req.params.jobId;
      if (!jobIdParam) {
        throw new CustomError("Job ID is required", 400);
      }
      const jobId = parseInt(jobIdParam, 10);
      const { expectedSalary } = req.body;

      if (!req.file) {
        throw new CustomError("CV file is required", 400);
      }

      const application = await ApplicationService.submitApplication(
        userId,
        jobId,
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
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user id" });
      }

      const applications = await ApplicationService.getApplicationsByUserId(
        userId
      );

      res.status(200).json({
        message: "Applications fetched successfully",
        data: applications,
      });
    } catch (err) {
      next(err);
    }
  }
}
