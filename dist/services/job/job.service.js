"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const prisma_1 = require("../../generated/prisma");
const job_repository_1 = require("../../repositories/job/job.repository");
const job_command_service_1 = require("./job.command.service");
const job_query_service_1 = require("./job.query.service");
class JobService {
    static async assertCompanyOwnership(companyId, requesterId) {
        const company = await job_repository_1.JobRepository.getCompany(companyId);
        if (!company)
            throw { status: 404, message: "Company not found" };
        const ownerId = company.ownerAdminId ?? company.adminId;
        if (ownerId !== requesterId)
            throw { status: 403, message: "You don't own this company" };
        return company;
    }
    static validateJobPayload(payload, isUpdate = false) {
        const errors = [];
        if (!isUpdate) {
            if (!payload?.title || typeof payload.title !== "string")
                errors.push("title is required");
            if (!payload?.description || typeof payload.description !== "string")
                errors.push("description is required");
            if (!payload?.category || typeof payload.category !== "string")
                errors.push("category is required");
            if (!payload?.city || typeof payload.city !== "string")
                errors.push("city is required");
        }
        if (payload?.deadline) {
            const d = new Date(payload.deadline);
            if (isNaN(d.getTime()))
                errors.push("deadline must be a valid date");
            // Only check past date for CREATE, not UPDATE
            else if (!isUpdate && d.getTime() < Date.now()) {
                errors.push("deadline cannot be in the past");
            }
        }
        if (payload?.tags && !Array.isArray(payload.tags))
            errors.push("tags must be an array of strings");
        if (errors.length)
            throw { status: 400, message: errors.join(", ") };
    }
    static async createJob(params) {
        const { companyId, requesterId, requesterRole, body } = params;
        if (requesterRole !== prisma_1.UserRole.ADMIN)
            throw { status: 401, message: "Only company admin can create jobs" };
        await this.assertCompanyOwnership(companyId, requesterId);
        this.validateJobPayload(body);
        return (0, job_command_service_1.createJobCore)({ companyId, body });
    }
    static async updateJob(params) {
        const { companyId, jobId, requesterId, requesterRole, body } = params;
        if (requesterRole !== prisma_1.UserRole.ADMIN)
            throw { status: 401, message: "Only company admin can update jobs" };
        await this.assertCompanyOwnership(companyId, requesterId);
        this.validateJobPayload(body, true);
        return (0, job_command_service_1.updateJobCore)({ companyId, jobId, body });
    }
    static async togglePublish(params) {
        const { companyId, jobId, requesterId, requesterRole, isPublished } = params;
        if (requesterRole !== prisma_1.UserRole.ADMIN)
            throw { status: 401, message: "Only company admin can publish/unpublish jobs" };
        await this.assertCompanyOwnership(companyId, requesterId);
        const coreParams = { companyId, jobId };
        if (typeof isPublished === "boolean")
            coreParams.isPublished = isPublished;
        return (0, job_command_service_1.togglePublishCore)(coreParams);
    }
    static async deleteJob(params) {
        const { companyId, jobId, requesterId, requesterRole } = params;
        if (requesterRole !== prisma_1.UserRole.ADMIN)
            throw { status: 401, message: "Only company admin can delete jobs" };
        await this.assertCompanyOwnership(companyId, requesterId);
        return (0, job_command_service_1.deleteJobCore)({ companyId, jobId });
    }
    static async listJobs(params) {
        const { companyId, requesterId, requesterRole, query } = params;
        this.validateAdminAccess(requesterRole);
        await this.assertCompanyOwnership(companyId, requesterId);
        return (0, job_query_service_1.listJobsCore)({ companyId, query });
    }
    static validateAdminAccess(requesterRole) {
        if (requesterRole !== prisma_1.UserRole.ADMIN) {
            throw { status: 401, message: "Only company admin can list their jobs" };
        }
    }
    static buildQueryParams(companyId, query) { return {}; }
    static formatJobListResponse(result) { return result; }
    static async listPublishedJobs(params) {
        const { query } = params;
        const repoQuery = {};
        if (typeof query.title === "string")
            repoQuery.title = query.title;
        if (typeof query.category === "string")
            repoQuery.category = query.category;
        if (typeof query.city === "string")
            repoQuery.city = query.city;
        if (query.sortBy === "createdAt" || query.sortBy === "deadline")
            repoQuery.sortBy = query.sortBy;
        if (query.sortOrder === "asc" || query.sortOrder === "desc")
            repoQuery.sortOrder = query.sortOrder;
        if (typeof query.limit === "number")
            repoQuery.limit = query.limit;
        if (typeof query.offset === "number")
            repoQuery.offset = query.offset;
        return (0, job_query_service_1.listPublishedJobsCore)({ query: repoQuery });
    }
    static async jobDetail(params) {
        const { companyId, jobId, requesterId, requesterRole } = params;
        if (requesterRole !== prisma_1.UserRole.ADMIN)
            throw { status: 401, message: "Only company admin can view job detail" };
        await this.assertCompanyOwnership(companyId, requesterId);
        return (0, job_query_service_1.jobDetailCore)({ companyId, jobId });
    }
}
exports.JobService = JobService;
