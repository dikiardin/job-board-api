"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewQueryService = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma_2 = require("../../config/prisma");
const interview_repository_1 = require("../../repositories/interview/interview.repository");
async function assertCompanyOwnershipByCompanyId(companyId, requesterId, requesterRole) {
    if (requesterRole !== prisma_1.UserRole.ADMIN)
        throw { status: 401, message: "Only company admin can view schedules" };
    const id = typeof companyId === 'string' ? Number(companyId) : companyId;
    const company = await prisma_2.prisma.company.findUnique({ where: { id } });
    if (!company)
        throw { status: 404, message: "Company not found" };
    const ownerId = company.ownerAdminId ?? company.adminId;
    if (ownerId !== requesterId)
        throw { status: 403, message: "You don't own this company" };
    return company;
}
async function assertCompanyOwnershipByInterview(interviewId, requesterId) {
    const interview = await prisma_2.prisma.interview.findUnique({
        where: { id: interviewId },
        include: { application: { include: { job: { include: { company: true } } } } },
    });
    if (!interview)
        throw { status: 404, message: "Interview not found" };
    if ((interview.application.job.company).ownerAdminId !== requesterId)
        throw { status: 403, message: "You don't own this company" };
    return interview;
}
class InterviewQueryService {
    static async getJobsWithApplicantCounts(params) {
        const { companyId, requesterId, requesterRole } = params;
        await assertCompanyOwnershipByCompanyId(companyId, requesterId, requesterRole);
        const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
        const jobs = await prisma_2.prisma.job.findMany({
            where: { companyId: cid },
            include: {
                applications: {
                    where: { status: 'ACCEPTED' },
                    select: { id: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return jobs.map(job => ({
            id: job.id,
            title: job.title,
            category: job.category,
            city: job.city,
            acceptedApplicantsCount: job.applications.length
        }));
    }
    static async getEligibleApplicants(params) {
        const { companyId, jobId, requesterId, requesterRole } = params;
        await assertCompanyOwnershipByCompanyId(companyId, requesterId, requesterRole);
        const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
        const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
        // Verify job exists and belongs to the company
        const job = await prisma_2.prisma.job.findFirst({
            where: { id: jid, companyId: cid }
        });
        if (!job) {
            throw { status: 404, message: "Job not found" };
        }
        const applications = await prisma_2.prisma.application.findMany({
            where: {
                jobId: jid,
                status: 'ACCEPTED'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return applications.map(app => ({
            userId: app.userId,
            userName: app.user.name || 'Unknown',
            userEmail: app.user.email,
            applicationId: app.id
        }));
    }
    static async list(params) {
        const { companyId, requesterId, requesterRole, query } = params;
        await assertCompanyOwnershipByCompanyId(companyId, requesterId, requesterRole);
        const dateFrom = query.dateFrom ? new Date(query.dateFrom) : undefined;
        const dateTo = query.dateTo ? new Date(query.dateTo) : undefined;
        const listParams = { companyId };
        if (typeof query.jobId === "string" || typeof query.jobId === 'number')
            listParams.jobId = query.jobId;
        if (typeof query.applicantId === "number")
            listParams.applicantId = query.applicantId;
        if (query.status)
            listParams.status = query.status;
        if (dateFrom)
            listParams.dateFrom = dateFrom;
        if (dateTo)
            listParams.dateTo = dateTo;
        if (typeof query.limit === "number")
            listParams.limit = query.limit;
        if (typeof query.offset === "number")
            listParams.offset = query.offset;
        const result = await interview_repository_1.InterviewRepository.list(listParams);
        // Map to lightweight DTO expected by frontend
        return {
            total: result.total,
            limit: result.limit,
            offset: result.offset,
            items: result.items.map((it) => ({
                id: it.id,
                applicationId: it.applicationId,
                scheduleDate: it.startsAt,
                locationOrLink: it.locationOrLink ?? null,
                notes: it.notes ?? null,
                status: it.status,
                candidateName: it.application?.user?.name,
                jobTitle: it.application?.job?.title,
            })),
        };
    }
    static async detail(params) {
        const { id, requesterId } = params;
        const interview = await assertCompanyOwnershipByInterview(id, requesterId);
        return interview;
    }
}
exports.InterviewQueryService = InterviewQueryService;
//# sourceMappingURL=interview.query.service.js.map