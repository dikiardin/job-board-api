"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewQueryService = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma_2 = require("../../config/prisma");
const interview_repository_1 = require("../../repositories/interview/interview.repository");
async function assertCompanyOwnershipByCompanyId(companyId, requesterId, requesterRole) {
    if (requesterRole !== prisma_1.UserRole.ADMIN)
        throw { status: 401, message: "Only company admin can view schedules" };
    const company = await prisma_2.prisma.company.findUnique({ where: { id: companyId } });
    if (!company)
        throw { status: 404, message: "Company not found" };
    if (company.adminId !== requesterId)
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
    if (interview.application.job.company.adminId !== requesterId)
        throw { status: 403, message: "You don't own this company" };
    return interview;
}
class InterviewQueryService {
    static async list(params) {
        const { companyId, requesterId, requesterRole, query } = params;
        await assertCompanyOwnershipByCompanyId(companyId, requesterId, requesterRole);
        const dateFrom = query.dateFrom ? new Date(query.dateFrom) : undefined;
        const dateTo = query.dateTo ? new Date(query.dateTo) : undefined;
        const listParams = { companyId };
        if (typeof query.jobId === "number")
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
        return result;
    }
    static async detail(params) {
        const { id, requesterId } = params;
        const interview = await assertCompanyOwnershipByInterview(id, requesterId);
        return interview;
    }
}
exports.InterviewQueryService = InterviewQueryService;
//# sourceMappingURL=interview.query.service.js.map