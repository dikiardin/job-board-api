"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewController = void 0;
const interview_command_service_1 = require("../../services/interview/interview.command.service");
const interview_query_service_1 = require("../../services/interview/interview.query.service");
class InterviewController {
    static async getJobsWithApplicantCounts(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const requester = res.locals.decrypt;
            const data = await interview_query_service_1.InterviewQueryService.getJobsWithApplicantCounts({
                companyId,
                requesterId: requester.userId,
                requesterRole: requester.role,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async getEligibleApplicants(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const jobId = req.params.jobId;
            const requester = res.locals.decrypt;
            const data = await interview_query_service_1.InterviewQueryService.getEligibleApplicants({
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
    static async createMany(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const jobId = req.params.jobId;
            const requester = res.locals.decrypt;
            const created = await interview_command_service_1.InterviewCommandService.createMany({
                companyId,
                jobId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                body: req.body,
            });
            res.status(201).json({ success: true, data: created });
        }
        catch (error) {
            next(error);
        }
    }
    static async list(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const requester = res.locals.decrypt;
            const { jobId, applicantId, status, dateFrom, dateTo, limit, offset } = req.query;
            const query = {};
            if (typeof jobId === "string")
                query.jobId = jobId;
            if (typeof applicantId === "string")
                query.applicantId = Number(applicantId);
            if (status === "SCHEDULED" || status === "COMPLETED" || status === "CANCELLED" || status === "NO_SHOW")
                query.status = status;
            if (typeof dateFrom === "string")
                query.dateFrom = dateFrom;
            if (typeof dateTo === "string")
                query.dateTo = dateTo;
            if (typeof limit === "string" && limit.trim() !== "")
                query.limit = Number(limit);
            if (typeof offset === "string" && offset.trim() !== "")
                query.offset = Number(offset);
            const data = await interview_query_service_1.InterviewQueryService.list({ companyId, requesterId: requester.userId, requesterRole: requester.role, query });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async detail(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const id = Number(req.params.id);
            const requester = res.locals.decrypt;
            const data = await interview_query_service_1.InterviewQueryService.detail({ companyId, id, requesterId: requester.userId, requesterRole: requester.role });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const requester = res.locals.decrypt;
            const updated = await interview_command_service_1.InterviewCommandService.update({ id, requesterId: requester.userId, requesterRole: requester.role, body: req.body });
            res.status(200).json({ success: true, data: updated });
        }
        catch (error) {
            next(error);
        }
    }
    static async remove(req, res, next) {
        try {
            const id = Number(req.params.id);
            const requester = res.locals.decrypt;
            const result = await interview_command_service_1.InterviewCommandService.remove({ id, requesterId: requester.userId, requesterRole: requester.role });
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.InterviewController = InterviewController;
