import { Request, Response, NextFunction } from "express";
import { InterviewCommandService } from "../../services/interview/interview.command.service";
import { InterviewQueryService } from "../../services/interview/interview.query.service";
import { InterviewStatus, UserRole } from "../../generated/prisma";

export class InterviewController {
  static async createMany(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const jobId = req.params.jobId as string;
      const requester = res.locals.decrypt as { userId: number; role: UserRole };

      const created = await InterviewCommandService.createMany({
        companyId,
        jobId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        body: req.body,
      });

      res.status(201).json({ success: true, data: created });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const requester = res.locals.decrypt as { userId: number; role: UserRole };

      const { jobId, applicantId, status, dateFrom, dateTo, limit, offset } = req.query as Record<string, any>;
      const query: { jobId?: string; applicantId?: number; status?: InterviewStatus; dateFrom?: string; dateTo?: string; limit?: number; offset?: number } = {};
      if (typeof jobId === "string") query.jobId = jobId;
      if (typeof applicantId === "string") query.applicantId = Number(applicantId);
      if (status === "SCHEDULED" || status === "COMPLETED" || status === "CANCELLED" || status === "NO_SHOW") query.status = status as InterviewStatus;
      if (typeof dateFrom === "string") query.dateFrom = dateFrom;
      if (typeof dateTo === "string") query.dateTo = dateTo;
      if (typeof limit === "string" && limit.trim() !== "") query.limit = Number(limit);
      if (typeof offset === "string" && offset.trim() !== "") query.offset = Number(offset);

      const data = await InterviewQueryService.list({ companyId, requesterId: requester.userId, requesterRole: requester.role, query });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const id = Number(req.params.id);
      const requester = res.locals.decrypt as { userId: number; role: UserRole };

      const data = await InterviewQueryService.detail({ companyId, id, requesterId: requester.userId, requesterRole: requester.role });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const requester = res.locals.decrypt as { userId: number; role: UserRole };

      const updated = await InterviewCommandService.update({ id, requesterId: requester.userId, requesterRole: requester.role, body: req.body });
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const requester = res.locals.decrypt as { userId: number; role: UserRole };

      const result = await InterviewCommandService.remove({ id, requesterId: requester.userId, requesterRole: requester.role });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
