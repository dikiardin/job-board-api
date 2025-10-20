import { Request, Response, NextFunction } from "express";
import { JobService } from "../../services/job/job.service";
import { parseListQuery, parsePublicListQuery, parseApplicantsQuery } from "./_helpers";
import { JobApplicantsService } from "../../services/job/job.applicants.service";
import { UserRole } from "../../generated/prisma";

export class JobController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const requester = res.locals.decrypt as {
        userId: number;
        role: UserRole;
      };

      const job = await JobService.createJob({
        companyId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        body: req.body,
      });

      res.status(201).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const requester = res.locals.decrypt as {
        userId: number;
        role: UserRole;
      };

      const query = parseListQuery(req);

      const data = await JobService.listJobs({
        companyId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        query,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async listPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const query = parsePublicListQuery(req);

      const data = await JobService.listPublishedJobs({ query });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const jobId = req.params.jobId as string;
      const requester = res.locals.decrypt as {
        userId: number;
        role: UserRole;
      };

      const data = await JobService.jobDetail({
        companyId,
        jobId,
        requesterId: requester.userId,
        requesterRole: requester.role,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const jobId = req.params.jobId as string;
      const requester = res.locals.decrypt as {
        userId: number;
        role: UserRole;
      };

      const job = await JobService.updateJob({
        companyId,
        jobId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        body: req.body,
      });

      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  static async togglePublish(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const jobId = req.params.jobId as string;
      const requester = res.locals.decrypt as {
        userId: number;
        role: UserRole;
      };
      const desired = (req.body as any)?.isPublished as boolean | undefined;
      const args: any = {
        companyId,
        jobId,
        requesterId: requester.userId,
        requesterRole: requester.role,
      };
      if (typeof desired === "boolean") args.isPublished = desired;
      const updated = await JobService.togglePublish(args);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const jobId = req.params.jobId as string;
      const requester = res.locals.decrypt as {
        userId: number;
        role: UserRole;
      };

      const result = await JobService.deleteJob({
        companyId,
        jobId,
        requesterId: requester.userId,
        requesterRole: requester.role,
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async applicantsList(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const jobId = req.params.jobId as string;
      const requester = res.locals.decrypt as {
        userId: number;
        role: UserRole;
      };

      const parsed = parseApplicantsQuery(req.query as any);
      if ((parsed as any).error) return res.status(400).json({ success: false, message: (parsed as any).error.message });
      const { query } = parsed as any;

      const data = await JobApplicantsService.listApplicants({
        companyId,
        jobId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        query,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async updateApplicantStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = req.params.companyId as string;
      const jobId = req.params.jobId as string;
      const applicationId = Number(req.params.applicationId);
      const requester = res.locals.decrypt as {
        userId: number;
        role: UserRole;
      };

      const data = await JobApplicantsService.updateApplicantStatus({
        companyId,
        jobId,
        applicationId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        body: req.body,
      });

      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
