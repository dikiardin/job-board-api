"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const job_service_1 = require("../../services/job/job.service");
const _helpers_1 = require("./_helpers");
const job_applicants_service_1 = require("../../services/job/job.applicants.service");
const success = (res, status, data) => res.status(status).json({ success: true, data });
const getRequester = (res) => res.locals.decrypt;
const respondWithAuth = async (req, res, next, handler) => {
    try {
        const companyId = req.params.companyId;
        const requester = getRequester(res);
        const context = { companyId, requester };
        if (req.params.jobId) {
            context.jobId = req.params.jobId;
        }
        const result = await handler(context);
        success(res, result.status ?? 200, result.data);
    }
    catch (error) {
        next(error);
    }
};
class JobController {
    static create(req, res, next) {
        return respondWithAuth(req, res, next, async ({ companyId, requester }) => {
            const job = await job_service_1.JobService.createJob({
                companyId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                body: req.body,
            });
            return { status: 201, data: job };
        });
    }
    static list(req, res, next) {
        const query = (0, _helpers_1.parseListQuery)(req);
        return respondWithAuth(req, res, next, async ({ companyId, requester }) => {
            const data = await job_service_1.JobService.listJobs({
                companyId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                query,
            });
            return { data };
        });
    }
    static async listPublic(req, res, next) {
        try {
            const query = (0, _helpers_1.parsePublicListQuery)(req);
            const data = await job_service_1.JobService.listPublishedJobs({ query });
            success(res, 200, data);
        }
        catch (error) {
            next(error);
        }
    }
    static detail(req, res, next) {
        return respondWithAuth(req, res, next, async ({ companyId, jobId, requester }) => {
            const data = await job_service_1.JobService.jobDetail({
                companyId,
                jobId: jobId,
                requesterId: requester.userId,
                requesterRole: requester.role,
            });
            return { data };
        });
    }
    static update(req, res, next) {
        return respondWithAuth(req, res, next, async ({ companyId, jobId, requester }) => {
            const job = await job_service_1.JobService.updateJob({
                companyId,
                jobId: jobId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                body: req.body,
            });
            return { data: job };
        });
    }
    static togglePublish(req, res, next) {
        const desired = req.body?.isPublished;
        return respondWithAuth(req, res, next, async ({ companyId, jobId, requester }) => {
            const updated = await job_service_1.JobService.togglePublish({
                companyId,
                jobId: jobId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                ...(typeof desired === "boolean" ? { isPublished: desired } : {}),
            });
            return { data: updated };
        });
    }
    static remove(req, res, next) {
        return respondWithAuth(req, res, next, async ({ companyId, jobId, requester }) => {
            const result = await job_service_1.JobService.deleteJob({
                companyId,
                jobId: jobId,
                requesterId: requester.userId,
                requesterRole: requester.role,
            });
            return { data: result };
        });
    }
    static applicantsList(req, res, next) {
        const parsed = (0, _helpers_1.parseApplicantsQuery)(req.query);
        if (parsed.error) {
            return res
                .status(400)
                .json({ success: false, message: parsed.error.message });
        }
        const { query } = parsed;
        return respondWithAuth(req, res, next, async ({ companyId, jobId, requester }) => {
            const data = await job_applicants_service_1.JobApplicantsService.listApplicants({
                companyId,
                jobId: jobId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                query,
            });
            return { data };
        });
    }
    static updateApplicantStatus(req, res, next) {
        const applicationId = Number(req.params.applicationId);
        return respondWithAuth(req, res, next, async ({ companyId, jobId, requester }) => {
            const data = await job_applicants_service_1.JobApplicantsService.updateApplicantStatus({
                companyId,
                jobId: jobId,
                applicationId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                body: req.body,
            });
            return { data };
        });
    }
}
exports.JobController = JobController;
