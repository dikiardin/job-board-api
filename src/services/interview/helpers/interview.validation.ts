import { UserRole } from "../../../generated/prisma";
import { prisma } from "../../../config/prisma";

export async function assertCompanyOwnershipByJob(jobId: string | number, requesterId: number) {
  const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
  const job = await prisma.job.findUnique({ where: { id: jid }, include: { company: true } });
  if (!job) throw { status: 404, message: "Job not found" };
  if ((job.company as any).ownerAdminId !== requesterId) throw { status: 403, message: "You don't own this company" };
  return job.companyId;
}

export async function assertCompanyOwnershipByInterview(interviewId: number, requesterId: number) {
  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: { application: { include: { job: { include: { company: true } } } } },
  });
  if (!interview) throw { status: 404, message: "Interview not found" };
  if (((interview.application.job.company) as any).ownerAdminId !== requesterId) throw { status: 403, message: "You don't own this company" };
  return interview;
}

export function validatePayload(payload: any, isUpdate = false) {
  const errors: string[] = [];
  if (!isUpdate) {
    if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
      errors.push("items is required and must be a non-empty array");
    }
  }
  if (payload?.items) {
    for (const it of payload.items) {
      if (typeof it.applicantId !== "number") errors.push("items[].applicantId must be number");
      if (!it.scheduleDate) errors.push("items[].scheduleDate is required");
      const d = new Date(it.scheduleDate);
      if (isNaN(d.getTime())) errors.push("items[].scheduleDate must be a valid date");
      else if (d.getTime() <= Date.now()) errors.push("scheduleDate cannot be in the past");
    }
  }
  if (payload?.scheduleDate) {
    const d = new Date(payload.scheduleDate);
    if (isNaN(d.getTime())) errors.push("scheduleDate must be a valid date");
    else if (d.getTime() <= Date.now()) errors.push("scheduleDate cannot be in the past");
  }
  if (errors.length) throw { status: 400, message: errors.join(", ") };
}

export function validateAdminAccess(requesterRole: UserRole): void {
  if (requesterRole !== UserRole.ADMIN) {
    throw { status: 401, message: "Only company admin can create schedules" };
  }
}
