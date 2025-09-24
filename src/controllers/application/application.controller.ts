// import { Request, Response, NextFunction } from "express";
// import { ApplicationService } from "../../services/application/application.service";
// import { UserRole } from "../../generated/prisma";

// export class ApplicationController {
//   static async create(req: Request, res: Response, next: NextFunction) {
//     try {
//       const jobId = Number(req.params.jobId);
//       const { cvFile, expectedSalary } = req.body as { cvFile: string; expectedSalary?: number };
//       const requester = res.locals.decrypt as { userId: number; role: UserRole };

//       const payload: any = {
//         requesterId: requester.userId,
//         requesterRole: requester.role,
//         jobId,
//         cvFile,
//       };
//       if (typeof expectedSalary === "number") payload.expectedSalary = expectedSalary;

//       const app = await ApplicationService.createApplication(payload);

//       res.status(201).json({ success: true, data: app });
//     } catch (error) {
//       next(error);
//     }
//   }
// }

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
}
