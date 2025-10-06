import { InterviewStatus, UserRole, ApplicationStatus } from "../../generated/prisma";
import { prisma } from "../../config/prisma";
import { InterviewRepository } from "../../repositories/interview/interview.repository";
import { InterviewEmailService } from "./interviewEmail.service";
async function assertCompanyOwnershipByJob(jobId: string | number, requesterId: number) {
  const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
  const job = await prisma.job.findUnique({ where: { id: jid }, include: { company: true } });
  if (!job) throw { status: 404, message: "Job not found" };
  if ((job.company as any).ownerAdminId !== requesterId) throw { status: 403, message: "You don't own this company" };
  return job.companyId;
}
async function assertCompanyOwnershipByInterview(interviewId: number, requesterId: number) {
  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: { application: { include: { job: { include: { company: true } } } } },
  });
  if (!interview) throw { status: 404, message: "Interview not found" };
  if (((interview.application.job.company) as any).ownerAdminId !== requesterId) throw { status: 403, message: "You don't own this company" };
  return interview;
}
function validatePayload(payload: any, isUpdate = false) {
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
export class InterviewCommandService {
  static async createMany(params: {
    companyId: string | number;
    jobId: string | number;
    requesterId: number;
    requesterRole: UserRole;
    body: { items: Array<{ applicantId: number; scheduleDate: string | Date; locationOrLink?: string | null; notes?: string | null }> };
  }) {
    const { jobId, requesterId, requesterRole, body } = params;
    
    this.validateAdminAccess(requesterRole);
    await assertCompanyOwnershipByJob(jobId, requesterId);
    validatePayload(body);
    
    const applications = await this.getApplicationsForJob(jobId, body.items);
    const toCreate = await this.prepareInterviewSchedules(body.items, applications);
    const created = await this.createInterviewSchedules(toCreate);
    await this.updateApplicationStatuses(created);
    await this.sendInterviewNotifications(created);
    
    return created;
  }

  private static validateAdminAccess(requesterRole: UserRole): void {
    if (requesterRole !== UserRole.ADMIN) {
      throw { status: 401, message: "Only company admin can create schedules" };
    }
  }

  private static async getApplicationsForJob(jobId: string | number, items: any[]) {
    const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
    return await prisma.application.findMany({
      where: { jobId: jid, userId: { in: items.map((i) => i.applicantId) } },
      include: { user: true },
    });
  }

  private static async prepareInterviewSchedules(items: any[], applications: any[]) {
    const appByUser = new Map(applications.map((a) => [a.userId, a]));
    const toCreate: Array<{ applicationId: number; scheduleDate: Date; locationOrLink?: string | null; notes?: string | null }> = [];
    
    for (const it of items) {
      const app = appByUser.get(it.applicantId);
      if (!app) throw { status: 400, message: `Applicant ${it.applicantId} has no application for this job` };
      if (app.status !== ApplicationStatus.ACCEPTED) throw { status: 400, message: `Applicant ${it.applicantId} is not in ACCEPTED status` };
      
      const scheduleDate = new Date(it.scheduleDate);
      const conflict = await InterviewRepository.findConflicts(app.id, new Date(scheduleDate.getTime()), new Date(scheduleDate.getTime()));
      if (conflict) throw { status: 400, message: `Schedule conflict for applicant ${it.applicantId}` };
      
      toCreate.push({ applicationId: app.id, scheduleDate, locationOrLink: it.locationOrLink ?? null, notes: it.notes ?? null });
    }
    
    return toCreate;
  }

  private static async createInterviewSchedules(toCreate: any[]) {
    return await InterviewRepository.createMany(toCreate);
  }

  private static async updateApplicationStatuses(created: any[]) {
    await prisma.application.updateMany({ 
      where: { id: { in: created.map((c: any) => c.applicationId) } }, 
      data: { status: "INTERVIEW" } as any 
    });
  }

  private static async sendInterviewNotifications(created: any[]) {
    for (const it of created as any[]) {
      await this.sendInterviewEmails(it);
    }
  }

  private static async sendInterviewEmails(interview: any) {
    const candidateEmail = interview.application.user.email as string;
    const candidateName = interview.application.user.name as string;
    const jobTitle = interview.application.job.title as string;
    const companyName = interview.application.job.company.name as string;
    const adminEmail = interview.application.job.company.owner?.email as string || undefined;
    const adminName = interview.application.job.company.owner?.name as string || null;

    await InterviewEmailService.sendCandidateEmail({
      type: "created",
      to: candidateEmail,
      candidateName,
      adminName,
      jobTitle,
      companyName,
      scheduleDate: new Date(interview.scheduleDate),
      locationOrLink: interview.locationOrLink ?? null,
      notes: interview.notes ?? null,
    });

    if (adminEmail) {
      await InterviewEmailService.sendAdminEmail({
        type: "created",
        to: adminEmail,
        adminName: adminName || "Admin",
        candidateName,
        jobTitle,
        companyName,
        scheduleDate: new Date(interview.scheduleDate),
        locationOrLink: interview.locationOrLink ?? null,
        notes: interview.notes ?? null,
      });
    }
  }
  static async update(params: {
    id: number;
    requesterId: number;
    requesterRole: UserRole;
    body: { scheduleDate?: string | Date; locationOrLink?: string | null; notes?: string | null; status?: InterviewStatus };
  }) {
    const { id, requesterId, requesterRole, body } = params;
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only company admin can update schedule" };
    const interview = await assertCompanyOwnershipByInterview(id, requesterId);
    validatePayload(body, true);
    const updateData: any = { ...body };
    if (typeof body.scheduleDate !== "undefined") {
      const d = new Date(body.scheduleDate as any);
      if (isNaN(d.getTime())) throw { status: 400, message: "scheduleDate must be a valid date" };
      if (d.getTime() <= Date.now()) throw { status: 400, message: "scheduleDate cannot be in the past" };
      const conflict = await InterviewRepository.findConflicts(interview.applicationId, new Date(d.getTime()), new Date(d.getTime()));
      if (conflict && conflict.id !== id) throw { status: 400, message: "Schedule conflict for this application" };
      updateData.scheduleDate = d;
      updateData.reminderSentAt = null;
      updateData.status = InterviewStatus.SCHEDULED;
    }
    const updated = (await InterviewRepository.updateOne(id, updateData)) as any;
    const type = updateData.status === InterviewStatus.CANCELLED ? "cancelled" : "updated";
    const candidateEmail = updated.application.user.email as string;
    const candidateName = updated.application.user.name as string;
    const jobTitle = updated.application.job.title as string;
    const companyName = updated.application.job.company.name as string;
    const adminEmail = (updated.application.job.company.owner?.email as string) || undefined;
    const adminName = (updated.application.job.company.owner?.name as string) || null;
    await InterviewEmailService.sendCandidateEmail({
      type,
      to: candidateEmail,
      candidateName,
      adminName,
      jobTitle,
      companyName,
      scheduleDate: new Date(updated.scheduleDate),
      locationOrLink: (updated.locationOrLink as string | null) ?? null,
      notes: (updated.notes as string | null) ?? null,
    });
    if (adminEmail) {
      await InterviewEmailService.sendAdminEmail({
        type,
        to: adminEmail,
        adminName: adminName || "Admin",
        candidateName,
        jobTitle,
        companyName,
        scheduleDate: new Date(updated.scheduleDate),
        locationOrLink: (updated.locationOrLink as string | null) ?? null,
        notes: (updated.notes as string | null) ?? null,
      });
    }
    return updated;
  }
  static async remove(params: { id: number; requesterId: number; requesterRole: UserRole }) {
    const { id, requesterId, requesterRole } = params;
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only company admin can delete schedule" };
    const interview = await assertCompanyOwnershipByInterview(id, requesterId);
    const candidateEmail = (interview as any).application.user.email as string;
    const candidateName = (interview as any).application.user.name as string;
    const jobTitle = (interview as any).application.job.title as string;
    const companyName = (interview as any).application.job.company.name as string;
    const adminEmail = (interview as any).application.job.company.owner?.email as string | undefined;
    const adminName = ((interview as any).application.job.company.owner?.name as string) || null;
    await InterviewEmailService.sendCandidateEmail({
      type: "cancelled",
      to: candidateEmail,
      candidateName,
      adminName,
      jobTitle,
      companyName,
      scheduleDate: new Date((interview as any).scheduleDate),
      locationOrLink: ((interview as any).locationOrLink as string | null) ?? null,
      notes: ((interview as any).notes as string | null) ?? null,
    });
    if (adminEmail) {
      await InterviewEmailService.sendAdminEmail({
        type: "cancelled",
        to: adminEmail,
        adminName: adminName || "Admin",
        candidateName,
        jobTitle,
        companyName,
        scheduleDate: new Date((interview as any).scheduleDate),
        locationOrLink: ((interview as any).locationOrLink as string | null) ?? null,
        notes: ((interview as any).notes as string | null) ?? null,
      });
    }
    await InterviewRepository.deleteOne(id);
    return { success: true };
  }
}
