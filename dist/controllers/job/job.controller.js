"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const job_service_1 = require("../../services/job/job.service");
const job_applicants_service_1 = require("../../services/job/job.applicants.service");
class JobController {
    static async create(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const requester = res.locals.decrypt;
            const job = await job_service_1.JobService.createJob({ companyId, requesterId: requester.userId, requesterRole: requester.role, body: req.body });
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
            const { title, category, sortBy, sortOrder, limit, offset } = res.locals.validatedQuery || req.query;
            const query = {};
            if (typeof title === "string")
                query.title = title;
            if (typeof category === "string")
                query.category = category;
            if (sortBy === "createdAt" || sortBy === "deadline")
                query.sortBy = sortBy;
            if (sortOrder === "asc" || sortOrder === "desc")
                query.sortOrder = sortOrder;
            if (typeof limit === "string" && limit.trim() !== "")
                query.limit = Number(limit);
            if (typeof offset === "string" && offset.trim() !== "")
                query.offset = Number(offset);
            const data = await job_service_1.JobService.listJobs({ companyId, requesterId: requester.userId, requesterRole: requester.role, query });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async listPublic(req, res, next) {
        try {
            const { title, category, city, sortBy, sortOrder, limit, offset } = req.query;
            const query = {};
            if (typeof title === "string")
                query.title = title;
            if (typeof category === "string")
                query.category = category;
            if (typeof city === "string")
                query.city = city;
            if (sortBy === "createdAt" || sortBy === "deadline")
                query.sortBy = sortBy;
            if (sortOrder === "asc" || sortOrder === "desc")
                query.sortOrder = sortOrder;
            if (typeof limit === "string" && limit.trim() !== "")
                query.limit = Number(limit);
            if (typeof offset === "string" && offset.trim() !== "")
                query.offset = Number(offset);
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
            const data = await job_service_1.JobService.jobDetail({ companyId, jobId, requesterId: requester.userId, requesterRole: requester.role });
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
            const job = await job_service_1.JobService.updateJob({ companyId, jobId, requesterId: requester.userId, requesterRole: requester.role, body: req.body });
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
            const args = { companyId, jobId, requesterId: requester.userId, requesterRole: requester.role };
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
            const result = await job_service_1.JobService.deleteJob({ companyId, jobId, requesterId: requester.userId, requesterRole: requester.role });
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
            const { name, education, ageMin, ageMax, expectedSalaryMin, expectedSalaryMax, sortBy, sortOrder, limit, offset } = req.query;
            const query = {};
            if (typeof name === "string")
                query.name = name;
            if (typeof education === "string")
                query.education = education;
            if (typeof ageMin === "string" && ageMin.trim() !== "") {
                const age = Number(ageMin);
                if (age < 0)
                    return res.status(400).json({ success: false, message: "Age minimum cannot be negative" });
                query.ageMin = age;
            }
            if (typeof ageMax === "string" && ageMax.trim() !== "") {
                const age = Number(ageMax);
                if (age < 0)
                    return res.status(400).json({ success: false, message: "Age maximum cannot be negative" });
                query.ageMax = age;
            }
            if (typeof expectedSalaryMin === "string" && expectedSalaryMin.trim() !== "")
                query.expectedSalaryMin = Number(expectedSalaryMin);
            if (typeof expectedSalaryMax === "string" && expectedSalaryMax.trim() !== "")
                query.expectedSalaryMax = Number(expectedSalaryMax);
            if (sortBy === "appliedAt" || sortBy === "expectedSalary" || sortBy === "age")
                query.sortBy = sortBy;
            if (sortOrder === "asc" || sortOrder === "desc")
                query.sortOrder = sortOrder;
            if (typeof limit === "string" && limit.trim() !== "") {
                const limitNum = Number(limit);
                if (limitNum < 0)
                    return res.status(400).json({ success: false, message: "Limit cannot be negative" });
                query.limit = Math.min(limitNum, 100);
            }
            if (typeof offset === "string" && offset.trim() !== "") {
                const offsetNum = Number(offset);
                if (offsetNum < 0)
                    return res.status(400).json({ success: false, message: "Offset cannot be negative" });
                query.offset = offsetNum;
            }
            const data = await job_applicants_service_1.JobApplicantsService.listApplicants({ companyId, jobId, requesterId: requester.userId, requesterRole: requester.role, query });
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
            const data = await job_applicants_service_1.JobApplicantsService.updateApplicantStatus({ companyId, jobId, applicationId, requesterId: requester.userId, requesterRole: requester.role, body: req.body });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.JobController = JobController;
//# sourceMappingURL=job.controller.js.map