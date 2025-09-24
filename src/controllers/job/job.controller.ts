import { Request, Response, NextFunction } from "express";
import { JobService } from "../../services/job/job.service";
import { JobApplicantsService } from "../../services/job/job.applicants.service";
import { UserRole } from "../../generated/prisma";

export class JobController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = Number(req.params.companyId);
      const requester = res.locals.decrypt as { userId: number; role: UserRole };

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
      const companyId = Number(req.params.companyId);
      const requester = res.locals.decrypt as { userId: number; role: UserRole };
      const { title, category, sortBy, sortOrder, limit, offset } = req.query as Record<string, any>;

      const query: { title?: string; category?: string; sortBy?: "createdAt" | "deadline"; sortOrder?: "asc" | "desc"; limit?: number; offset?: number } = {};
      if (typeof title === "string") query.title = title;
      if (typeof category === "string") query.category = category;
      if (sortBy === "createdAt" || sortBy === "deadline") query.sortBy = sortBy;
      if (sortOrder === "asc" || sortOrder === "desc") query.sortOrder = sortOrder;
      if (typeof limit === "string" && limit.trim() !== "") query.limit = Number(limit);
      if (typeof offset === "string" && offset.trim() !== "") query.offset = Number(offset);

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

  static async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = Number(req.params.companyId);
      const jobId = Number(req.params.jobId);
      const requester = res.locals.decrypt as { userId: number; role: UserRole };

      const data = await JobService.jobDetail({ companyId, jobId, requesterId: requester.userId, requesterRole: requester.role });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = Number(req.params.companyId);
      const jobId = Number(req.params.jobId);
      const requester = res.locals.decrypt as { userId: number; role: UserRole };

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
      const companyId = Number(req.params.companyId);
      const jobId = Number(req.params.jobId);
      const requester = res.locals.decrypt as { userId: number; role: UserRole };

      const updated = await JobService.togglePublish({ companyId, jobId, requesterId: requester.userId, requesterRole: requester.role });
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = Number(req.params.companyId);
      const jobId = Number(req.params.jobId);
      const requester = res.locals.decrypt as { userId: number; role: UserRole };

      const result = await JobService.deleteJob({ companyId, jobId, requesterId: requester.userId, requesterRole: requester.role });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async applicantsList(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = Number(req.params.companyId);
      const jobId = Number(req.params.jobId);
      const requester = res.locals.decrypt as { userId: number; role: UserRole };

      const { name, education, ageMin, ageMax, expectedSalaryMin, expectedSalaryMax, sortBy, sortOrder, limit, offset } = req.query as Record<string, any>;
      const query: any = {};
      if (typeof name === "string") query.name = name;
      if (typeof education === "string") query.education = education;
      if (typeof ageMin === "string" && ageMin.trim() !== "") query.ageMin = Number(ageMin);
      if (typeof ageMax === "string" && ageMax.trim() !== "") query.ageMax = Number(ageMax);
      if (typeof expectedSalaryMin === "string" && expectedSalaryMin.trim() !== "") query.expectedSalaryMin = Number(expectedSalaryMin);
      if (typeof expectedSalaryMax === "string" && expectedSalaryMax.trim() !== "") query.expectedSalaryMax = Number(expectedSalaryMax);
      if (sortBy === "appliedAt" || sortBy === "expectedSalary" || sortBy === "age") query.sortBy = sortBy;
      if (sortOrder === "asc" || sortOrder === "desc") query.sortOrder = sortOrder;
      if (typeof limit === "string" && limit.trim() !== "") query.limit = Number(limit);
      if (typeof offset === "string" && offset.trim() !== "") query.offset = Number(offset);

      const data = await JobApplicantsService.listApplicants({ companyId, jobId, requesterId: requester.userId, requesterRole: requester.role, query });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async updateApplicantStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = Number(req.params.companyId);
      const jobId = Number(req.params.jobId);
      const applicationId = Number(req.params.applicationId);
      const requester = res.locals.decrypt as { userId: number; role: UserRole };

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
