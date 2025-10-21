import { Request, Response, NextFunction } from "express";
import { PreselectionService } from "../../services/preselection/preselection.service";
import { UserRole } from "../../generated/prisma";

export class PreselectionController {
  static async createTest(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = req.params.jobId as string;
      const { questions, passingScore, isActive } = req.body;
      const requester = res.locals.decrypt as { userId: number; role: UserRole };

      const created = await PreselectionService.createOrUpdateTest({
        jobId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        questions,
        passingScore,
        isActive,
      });

      res.status(201).json({ success: true, data: created });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTest(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = req.params.jobId as string;
      const requester = res.locals.decrypt as { userId: number; role: UserRole };

      await PreselectionService.deleteTestByJobId({
        jobId,
        requesterId: requester.userId,
        requesterRole: requester.role,
      });

      res.status(200).json({ success: true, message: "Preselection test deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async getTest(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = req.params.jobId as string;
      const requester = res.locals.decrypt as { role?: UserRole };
      const data = await PreselectionService.getTestForJob(jobId, requester?.role);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const pathApplicantId = Number(req.params.applicantId);
      const testId = Number(req.params.testId);
      const { answers } = req.body as { answers: Array<{ questionId: number; selected: string }> };
      const requester = res.locals.decrypt as { userId: number; role: UserRole };

      const result = await PreselectionService.submitAnswers({
        applicantId: requester.userId,
        pathApplicantId,
        testId,
        requesterRole: requester.role,
        answers,
      });

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getJobResults(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = req.params.jobId as string;
      const requester = res.locals.decrypt as { userId: number; role: UserRole };
      const data = await PreselectionService.getJobResults({ jobId, requesterId: requester.userId, requesterRole: requester.role });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async myStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = req.params.jobId as string;
      const requester = res.locals.decrypt as { userId: number; role: UserRole };
      const data = await PreselectionService.statusForUser({ jobId, userId: requester.userId });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
