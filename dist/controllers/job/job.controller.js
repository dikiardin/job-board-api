"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const job_service_1 = require("../../services/job/job.service");
const _helpers_1 = require("./_helpers");
const job_applicants_service_1 = require("../../services/job/job.applicants.service");
class JobController {
    static async create(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const requester = res.locals.decrypt;
            const job = await job_service_1.JobService.createJob({
                companyId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                body: req.body,
            });
            res.status(201).json({ success: true, data: job });
        }
        catch (error) {
            next(error);
        }
    }
    static async list(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const requester = res.locals.decrypt;
            const query = (0, _helpers_1.parseListQuery)(req);
            const data = await job_service_1.JobService.listJobs({
                companyId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                query,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async listPublic(req, res, next) {
        try {
            const query = (0, _helpers_1.parsePublicListQuery)(req);
            const data = await job_service_1.JobService.listPublishedJobs({ query });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async detail(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const jobId = req.params.jobId;
            const requester = res.locals.decrypt;
            const data = await job_service_1.JobService.jobDetail({
                companyId,
                jobId,
                requesterId: requester.userId,
                requesterRole: requester.role,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const jobId = req.params.jobId;
            const requester = res.locals.decrypt;
            const job = await job_service_1.JobService.updateJob({
                companyId,
                jobId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                body: req.body,
            });
            res.status(200).json({ success: true, data: job });
        }
        catch (error) {
            next(error);
        }
    }
    static async togglePublish(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const jobId = req.params.jobId;
            const requester = res.locals.decrypt;
            const desired = req.body?.isPublished;
            const args = {
                companyId,
                jobId,
                requesterId: requester.userId,
                requesterRole: requester.role,
            };
            if (typeof desired === "boolean")
                args.isPublished = desired;
            const updated = await job_service_1.JobService.togglePublish(args);
            res.status(200).json({ success: true, data: updated });
        }
        catch (error) {
            next(error);
        }
    }
    static async remove(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const jobId = req.params.jobId;
            const requester = res.locals.decrypt;
            const result = await job_service_1.JobService.deleteJob({
                companyId,
                jobId,
                requesterId: requester.userId,
                requesterRole: requester.role,
            });
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async applicantsList(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const jobId = req.params.jobId;
            const requester = res.locals.decrypt;
            const parsed = (0, _helpers_1.parseApplicantsQuery)(req.query);
            if (parsed.error)
                return res.status(400).json({ success: false, message: parsed.error.message });
            const { query } = parsed;
            const data = await job_applicants_service_1.JobApplicantsService.listApplicants({
                companyId,
                jobId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                query,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateApplicantStatus(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const jobId = req.params.jobId;
            const applicationId = Number(req.params.applicationId);
            const requester = res.locals.decrypt;
            const data = await job_applicants_service_1.JobApplicantsService.updateApplicantStatus({
                companyId,
                jobId,
                applicationId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                body: req.body,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.JobController = JobController;
