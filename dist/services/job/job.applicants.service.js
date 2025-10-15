"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicantsService = void 0;
const prisma_1 = require("../../generated/prisma");
const job_repository_1 = require("../../repositories/job/job.repository");
const application_repository_1 = require("../../repositories/application/application.repository");
const preselection_repository_1 = require("../../repositories/preselection/preselection.repository");
async function assertCompanyOwnership(companyId, requesterId) {
    const company = await job_repository_1.JobRepository.getCompany(companyId);
    if (!company)
        throw { status: 404, message: "Company not found" };
    const ownerId = company.ownerAdminId ?? company.adminId;
    if (ownerId !== requesterId)
        throw { status: 403, message: "You don't own this company" };
    return company;
}
class JobApplicantsService {
    static async updateApplicantStatus(params) {
        const { companyId, jobId, applicationId, requesterId, requesterRole, body, } = params;
        if (requesterRole !== prisma_1.UserRole.ADMIN)
            throw {
                status: 401,
                message: "Only company admin can update applicant status",
            };
        await assertCompanyOwnership(companyId, requesterId);
        const app = await application_repository_1.ApplicationRepo.getApplicationWithOwnership(applicationId);
        const jid = typeof jobId === "string" ? Number(jobId) : jobId;
        const cid = typeof companyId === "string" ? Number(companyId) : companyId;
        if (!app || app.jobId !== jid || app.job.companyId !== cid)
            throw { status: 404, message: "Application not found" };
        const allowed = [
            prisma_1.ApplicationStatus.IN_REVIEW,
            prisma_1.ApplicationStatus.INTERVIEW,
            prisma_1.ApplicationStatus.ACCEPTED,
            prisma_1.ApplicationStatus.REJECTED,
        ];
        if (!allowed.includes(body.status))
            throw { status: 400, message: "Invalid status transition" };
        const updated = await application_repository_1.ApplicationRepo.updateApplicationStatus(applicationId, body.status, body.reviewNote ?? null);
        return {
            id: updated.id,
            status: updated.status,
            reviewNote: updated.reviewNote,
            updatedAt: updated.updatedAt,
        };
    }
    static async listApplicants(params) {
        const { companyId, jobId, requesterId, requesterRole, query } = params;
        if (requesterRole !== prisma_1.UserRole.ADMIN)
            throw { status: 401, message: "Only company admin can list applicants" };
        await assertCompanyOwnership(companyId, requesterId);
        // Verify job exists and belongs to the company
        const job = await job_repository_1.JobRepository.getJobById(companyId, jobId);
        if (!job) {
            throw { status: 404, message: "Job not found" };
        }
        const result = await job_repository_1.JobRepository.listApplicantsForJob({
            companyId,
            jobId,
            ...(typeof query.name === "string" ? { name: query.name } : {}),
            ...(typeof query.education === "string"
                ? { education: query.education }
                : {}),
            ...(typeof query.ageMin === "number" ? { ageMin: query.ageMin } : {}),
            ...(typeof query.ageMax === "number" ? { ageMax: query.ageMax } : {}),
            ...(typeof query.expectedSalaryMin === "number"
                ? { expectedSalaryMin: query.expectedSalaryMin }
                : {}),
            ...(typeof query.expectedSalaryMax === "number"
                ? { expectedSalaryMax: query.expectedSalaryMax }
                : {}),
            ...(query.sortBy ? { sortBy: query.sortBy } : {}),
            ...(query.sortOrder ? { sortOrder: query.sortOrder } : {}),
            ...(typeof query.limit === "number" ? { limit: query.limit } : {}),
            ...(typeof query.offset === "number" ? { offset: query.offset } : {}),
        });
        // Attach preselection test results if available
        let scoreByUser = new Map();
        let passingScore = null;
        const test = await preselection_repository_1.PreselectionRepository.getTestByJobId(jobId);
        if (test) {
            passingScore = test.passingScore ?? null;
            const userIds = result.items.map((a) => a.userId);
            const results = await preselection_repository_1.PreselectionRepository.getResultsByTestAndUsers(test.id, userIds);
            scoreByUser = new Map(results.map((r) => [r.userId, r.score]));
        }
        return {
            total: result.total,
            limit: result.limit,
            offset: result.offset,
            items: result.items.map((a) => {
                const score = scoreByUser.get(a.userId) ?? null;
                const preselectionPassed = score != null
                    ? passingScore != null
                        ? score >= passingScore
                        : true
                    : null;
                const result = {
                    applicationId: a.id,
                    userId: a.userId,
                    userName: a.user?.name || "Unknown",
                    userEmail: a.user?.email || "unknown@example.com",
                    profilePicture: a.user?.profilePicture ?? null,
                    appliedAt: a.createdAt,
                    expectedSalary: a.expectedSalary ?? null,
                    status: a.status,
                    cvFile: a.cvUrl ?? null,
                    score: score,
                    preselectionPassed,
                    isPriority: a.isPriority ?? false, // ← IMPORTANT: Include priority field
                    education: a.user?.education ?? null,
                    age: a.user?.dob
                        ? Math.floor((Date.now() - new Date(a.user.dob).getTime()) /
                            (365.25 * 24 * 60 * 60 * 1000))
                        : null,
                };
                return result;
            }),
        };
    }
}
exports.JobApplicantsService = JobApplicantsService;
//# sourceMappingURL=job.applicants.service.js.map