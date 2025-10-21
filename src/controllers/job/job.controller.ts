import { Request, Response, NextFunction } from "express";
import { JobService } from "../../services/job/job.service";
import {
  parseListQuery,
  parsePublicListQuery,
  parseApplicantsQuery,
} from "./_helpers";
import { JobApplicantsService } from "../../services/job/job.applicants.service";
import { UserRole } from "../../generated/prisma";

type RequesterPayload = { userId: number; role: UserRole };

type HandlerResult = { status?: number; data: unknown };

const success = (res: Response, status: number, data: unknown) =>
  res.status(status).json({ success: true, data });

const getRequester = (res: Response): RequesterPayload =>
  res.locals.decrypt as RequesterPayload;

const respondWithAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
  handler: (ctx: {
    companyId: string;
    jobId?: string;
    requester: RequesterPayload;
  }) => Promise<HandlerResult>
) => {
  try {
    const companyId = req.params.companyId as string;
    const requester = getRequester(res);
    const context: {
      companyId: string;
      jobId?: string;
      requester: RequesterPayload;
    } = { companyId, requester };

    if (req.params.jobId) {
      context.jobId = req.params.jobId as string;
    }

    const result = await handler(context);
    success(res, result.status ?? 200, result.data);
  } catch (error) {
    next(error);
  }
};

export class JobController {
  static create(req: Request, res: Response, next: NextFunction) {
    return respondWithAuth(req, res, next, async ({ companyId, requester }) => {
      const job = await JobService.createJob({
        companyId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        body: req.body,
      });
      return { status: 201, data: job };
    });
  }

  static list(req: Request, res: Response, next: NextFunction) {
    const query = parseListQuery(req);
    return respondWithAuth(req, res, next, async ({ companyId, requester }) => {
      const data = await JobService.listJobs({
        companyId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        query,
      });
      return { data };
    });
  }

  static async listPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const query = parsePublicListQuery(req);
      const data = await JobService.listPublishedJobs({ query });
      success(res, 200, data);
    } catch (error) {
      next(error);
    }
  }

  static detail(req: Request, res: Response, next: NextFunction) {
    return respondWithAuth(req, res, next, async ({ companyId, jobId, requester }) => {
      const data = await JobService.jobDetail({
        companyId,
        jobId: jobId as string,
        requesterId: requester.userId,
        requesterRole: requester.role,
      });
      return { data };
    });
  }

  static update(req: Request, res: Response, next: NextFunction) {
    return respondWithAuth(req, res, next, async ({ companyId, jobId, requester }) => {
      const job = await JobService.updateJob({
        companyId,
        jobId: jobId as string,
        requesterId: requester.userId,
        requesterRole: requester.role,
        body: req.body,
      });
      return { data: job };
    });
  }

  static togglePublish(req: Request, res: Response, next: NextFunction) {
    const desired = (req.body as any)?.isPublished as boolean | undefined;
    return respondWithAuth(req, res, next, async ({ companyId, jobId, requester }) => {
      const updated = await JobService.togglePublish({
        companyId,
        jobId: jobId as string,
        requesterId: requester.userId,
        requesterRole: requester.role,
        ...(typeof desired === "boolean" ? { isPublished: desired } : {}),
      });
      return { data: updated };
    });
  }

  static remove(req: Request, res: Response, next: NextFunction) {
    return respondWithAuth(req, res, next, async ({ companyId, jobId, requester }) => {
      const result = await JobService.deleteJob({
        companyId,
        jobId: jobId as string,
        requesterId: requester.userId,
        requesterRole: requester.role,
      });
      return { data: result };
    });
  }

  static applicantsList(req: Request, res: Response, next: NextFunction) {
    const parsed = parseApplicantsQuery(req.query as any);
    if ((parsed as any).error) {
      return res
        .status(400)
        .json({ success: false, message: (parsed as any).error.message });
    }
    const { query } = parsed as any;

    return respondWithAuth(req, res, next, async ({ companyId, jobId, requester }) => {
      const data = await JobApplicantsService.listApplicants({
        companyId,
        jobId: jobId as string,
        requesterId: requester.userId,
        requesterRole: requester.role,
        query,
      });
      return { data };
    });
  }

  static updateApplicantStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const applicationId = Number(req.params.applicationId);
    return respondWithAuth(req, res, next, async ({ companyId, jobId, requester }) => {
      const data = await JobApplicantsService.updateApplicantStatus({
        companyId,
        jobId: jobId as string,
        applicationId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        body: req.body,
      });
      return { data };
    });
  }
}
