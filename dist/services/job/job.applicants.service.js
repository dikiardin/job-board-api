"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicantsService = void 0;
const prisma_1 = require("../../generated/prisma");
const job_repository_1 = require("../../repositories/job/job.repository");
const application_repository_1 = require("../../repositories/application/application.repository");
async function assertCompanyOwnership(companyId, requesterId) {
    const company = await job_repository_1.JobRepository.getCompany(companyId);
    if (!company)
        throw { status: 404, message: "Company not found" };
    if (company.adminId !== requesterId)
        throw { status: 403, message: "You don't own this company" };
    return company;
}
class JobApplicantsService {
    static async updateApplicantStatus(params) {
        const { companyId, jobId, applicationId, requesterId, requesterRole, body } = params;
        if (requesterRole !== prisma_1.UserRole.ADMIN)
            throw { status: 401, message: "Only company admin can update applicant status" };
        await assertCompanyOwnership(companyId, requesterId);
        const app = await application_repository_1.ApplicationRepo.getApplicationWithOwnership(applicationId);
        if (!app || app.jobId !== jobId || app.job.companyId !== companyId)
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
        return { id: updated.id, status: updated.status, reviewNote: updated.reviewNote, updatedAt: updated.updatedAt };
    }
    static async listApplicants(params) {
        const { companyId, jobId, requesterId, requesterRole, query } = params;
        if (requesterRole !== prisma_1.UserRole.ADMIN)
            throw { status: 401, message: "Only company admin can list applicants" };
        await assertCompanyOwnership(companyId, requesterId);
        const result = await job_repository_1.JobRepository.listApplicantsForJob({
            companyId,
            jobId,
            ...(typeof query.name === "string" ? { name: query.name } : {}),
            ...(typeof query.education === "string" ? { education: query.education } : {}),
            ...(typeof query.ageMin === "number" ? { ageMin: query.ageMin } : {}),
            ...(typeof query.ageMax === "number" ? { ageMax: query.ageMax } : {}),
            ...(typeof query.expectedSalaryMin === "number" ? { expectedSalaryMin: query.expectedSalaryMin } : {}),
            ...(typeof query.expectedSalaryMax === "number" ? { expectedSalaryMax: query.expectedSalaryMax } : {}),
            ...(query.sortBy ? { sortBy: query.sortBy } : {}),
            ...(query.sortOrder ? { sortOrder: query.sortOrder } : {}),
            ...(typeof query.limit === "number" ? { limit: query.limit } : {}),
            ...(typeof query.offset === "number" ? { offset: query.offset } : {}),
        });
        return {
            total: result.total,
            limit: result.limit,
            offset: result.offset,
            items: result.items.map((a) => ({
                applicationId: a.id,
                appliedAt: a.createdAt,
                expectedSalary: a.expectedSalary ?? null,
                status: a.status,
                cvFile: a.cvFile,
                user: {
                    id: a.userId,
                    name: a.user?.name,
                    email: a.user?.email,
                    profilePicture: a.user?.profilePicture ?? null,
                    education: a.user?.education ?? null,
                    dob: a.user?.dob ?? null,
                },
            })),
        };
    }
}
exports.JobApplicantsService = JobApplicantsService;
//# sourceMappingURL=job.applicants.service.js.map