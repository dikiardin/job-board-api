import { Request, Response, NextFunction } from "express";
import { JobService } from "../../services/job/job.service";
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

      const { title, category, sortBy, sortOrder, limit, offset } =
        res.locals.validatedQuery || (req.query as Record<string, any>);

      const query: {
        title?: string;
        category?: string;
        sortBy?: "createdAt" | "deadline";
        sortOrder?: "asc" | "desc";
        limit?: number;
        offset?: number;
      } = {};
      if (typeof title === "string") query.title = title;
      if (typeof category === "string") query.category = category;
      if (sortBy === "createdAt" || sortBy === "deadline")
        query.sortBy = sortBy;
      if (sortOrder === "asc" || sortOrder === "desc")
        query.sortOrder = sortOrder;
      if (typeof limit === "string" && limit.trim() !== "")
        query.limit = Number(limit);
      if (typeof offset === "string" && offset.trim() !== "")
        query.offset = Number(offset);

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
      const { title, category, city, sortBy, sortOrder, limit, offset } =
        req.query as Record<string, any>;
      const query: {
        title?: string;
        category?: string;
        city?: string;
        sortBy?: "createdAt" | "deadline";
        sortOrder?: "asc" | "desc";
        limit?: number;
        offset?: number;
      } = {};
      if (typeof title === "string") query.title = title;
      if (typeof category === "string") query.category = category;
      if (typeof city === "string") query.city = city;
      if (sortBy === "createdAt" || sortBy === "deadline")
        query.sortBy = sortBy;
      if (sortOrder === "asc" || sortOrder === "desc")
        query.sortOrder = sortOrder;
      if (typeof limit === "string" && limit.trim() !== "")
        query.limit = Number(limit);
      if (typeof offset === "string" && offset.trim() !== "")
        query.offset = Number(offset);

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

      const {
        name,
        education,
        ageMin,
        ageMax,
        expectedSalaryMin,
        expectedSalaryMax,
        sortBy,
        sortOrder,
        limit,
        offset,
      } = req.query as Record<string, any>;
      const query: any = {};
      if (typeof name === "string") query.name = name;
      if (typeof education === "string") query.education = education;
      if (typeof ageMin === "string" && ageMin.trim() !== "") {
        const age = Number(ageMin);
        if (age < 0) {
          return res.status(400).json({ 
            success: false, 
            message: "Age minimum cannot be negative" 
          });
        }
        query.ageMin = age;
      }
      if (typeof ageMax === "string" && ageMax.trim() !== "") {
        const age = Number(ageMax);
        if (age < 0) {
          return res.status(400).json({ 
            success: false, 
            message: "Age maximum cannot be negative" 
          });
        }
        query.ageMax = age;
      }
      if (
        typeof expectedSalaryMin === "string" &&
        expectedSalaryMin.trim() !== ""
      )
        query.expectedSalaryMin = Number(expectedSalaryMin);
      if (
        typeof expectedSalaryMax === "string" &&
        expectedSalaryMax.trim() !== ""
      )
        query.expectedSalaryMax = Number(expectedSalaryMax);
      if (
        sortBy === "appliedAt" ||
        sortBy === "expectedSalary" ||
        sortBy === "age"
      )
        query.sortBy = sortBy;
      if (sortOrder === "asc" || sortOrder === "desc")
        query.sortOrder = sortOrder;
      if (typeof limit === "string" && limit.trim() !== "") {
        const limitNum = Number(limit);
        if (limitNum < 0) {
          return res.status(400).json({ 
            success: false, 
            message: "Limit cannot be negative" 
          });
        }
        // Cap limit to prevent performance issues
        const MAX_LIMIT = 100;
        query.limit = Math.min(limitNum, MAX_LIMIT);
      }
      if (typeof offset === "string" && offset.trim() !== "") {
        const offsetNum = Number(offset);
        if (offsetNum < 0) {
          return res.status(400).json({ 
            success: false, 
            message: "Offset cannot be negative" 
          });
        }
        query.offset = offsetNum;
      }

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
