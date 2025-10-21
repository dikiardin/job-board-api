import { ApplicationStatus } from "../../../generated/prisma";
import { prisma } from "../../../config/prisma";
import { InterviewRepository } from "../../../repositories/interview/interview.repository";

export async function getApplicationsForJob(jobId: string | number, items: any[]) {
  const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
  return await prisma.application.findMany({
    where: { jobId: jid, userId: { in: items.map((i) => i.applicantId) } },
    include: { user: true },
  });
}

export async function prepareInterviewSchedules(items: any[], applications: any[]) {
  const appByUser = new Map(applications.map((a) => [a.userId, a]));
  const toCreate: Array<{ applicationId: number; startsAt: Date; locationOrLink?: string | null; notes?: string | null }> = [];
  const eligibleStatuses: ApplicationStatus[] = [ApplicationStatus.INTERVIEW];
  
  for (const it of items) {
    const app = appByUser.get(it.applicantId);
    if (!app) throw { status: 400, message: `Applicant ${it.applicantId} has no application for this job` };
    if (!eligibleStatuses.includes(app.status))
      throw {
        status: 400,
        message: `Applicant ${it.applicantId} must be in INTERVIEW status before scheduling`,
      };
    
    const scheduleDate = new Date(it.scheduleDate);
    const conflict = await InterviewRepository.findConflicts(app.id, new Date(scheduleDate.getTime()), new Date(scheduleDate.getTime()));
    if (conflict) throw { status: 400, message: `Schedule conflict for applicant ${it.applicantId}` };
    
    toCreate.push({ applicationId: app.id, startsAt: scheduleDate, locationOrLink: it.locationOrLink ?? null, notes: it.notes ?? null });
  }
  
  return toCreate;
}
