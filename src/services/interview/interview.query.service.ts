import { InterviewStatus, UserRole } from "../../generated/prisma";
import { prisma } from "../../config/prisma";
import { InterviewRepository } from "../../repositories/interview/interview.repository";

async function assertCompanyOwnershipByCompanyId(companyId: string, requesterId: number, requesterRole: UserRole) {
  if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only company admin can view schedules" };
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) throw { status: 404, message: "Company not found" };
  if (company.adminId !== requesterId) throw { status: 403, message: "You don't own this company" };
  return company;
}

async function assertCompanyOwnershipByInterview(interviewId: number, requesterId: number) {
  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: { application: { include: { job: { include: { company: true } } } } },
  });
  if (!interview) throw { status: 404, message: "Interview not found" };
  if (interview.application.job.company.adminId !== requesterId) throw { status: 403, message: "You don't own this company" };
  return interview;
}

export class InterviewQueryService {
  static async list(params: {
    companyId: string;
    requesterId: number;
    requesterRole: UserRole;
    query: { jobId?: string; applicantId?: number; status?: InterviewStatus; dateFrom?: string; dateTo?: string; limit?: number; offset?: number };
  }) {
    const { companyId, requesterId, requesterRole, query } = params;
    await assertCompanyOwnershipByCompanyId(companyId, requesterId, requesterRole);

    const dateFrom = query.dateFrom ? new Date(query.dateFrom) : undefined;
    const dateTo = query.dateTo ? new Date(query.dateTo) : undefined;

    const listParams: any = { companyId };
    if (typeof query.jobId === "string") listParams.jobId = query.jobId;
    if (typeof query.applicantId === "number") listParams.applicantId = query.applicantId;
    if (query.status) listParams.status = query.status;
    if (dateFrom) listParams.dateFrom = dateFrom;
    if (dateTo) listParams.dateTo = dateTo;
    if (typeof query.limit === "number") listParams.limit = query.limit;
    if (typeof query.offset === "number") listParams.offset = query.offset;

    const result = await InterviewRepository.list(listParams);
    // Map to lightweight DTO expected by frontend
    return {
      total: result.total,
      limit: result.limit,
      offset: result.offset,
      items: result.items.map((it: any) => ({
        id: it.id,
        applicationId: it.applicationId,
        scheduleDate: it.scheduleDate,
        locationOrLink: it.locationOrLink ?? null,
        notes: it.notes ?? null,
        status: it.status,
        candidateName: it.application?.user?.name,
        jobTitle: it.application?.job?.title,
      })),
    };
  }

  static async detail(params: { companyId: string; id: number; requesterId: number; requesterRole: UserRole }) {
    const { id, requesterId } = params;
    const interview = await assertCompanyOwnershipByInterview(id, requesterId);
    return interview;
  }
}
