import { InterviewEmailService } from "../interviewEmail.service";

export async function sendInterviewEmails(interview: any, type: "created" | "updated" | "cancelled") {
  const candidateEmail = interview.application.user.email as string;
  const candidateName = interview.application.user.name as string;
  const jobTitle = interview.application.job.title as string;
  const companyName = interview.application.job.company.name as string;
  const adminEmail = interview.application.job.company.owner?.email as string || undefined;
  const adminName = interview.application.job.company.owner?.name as string || null;

  await InterviewEmailService.sendCandidateEmail({
    type,
    to: candidateEmail,
    candidateName,
    adminName,
    jobTitle,
    companyName,
    scheduleDate: new Date(interview.startsAt),
    locationOrLink: interview.locationOrLink ?? null,
    notes: interview.notes ?? null,
  });

  if (adminEmail) {
    await InterviewEmailService.sendAdminEmail({
      type,
      to: adminEmail,
      adminName: adminName || "Admin",
      candidateName,
      jobTitle,
      companyName,
      scheduleDate: new Date(interview.startsAt),
      locationOrLink: interview.locationOrLink ?? null,
      notes: interview.notes ?? null,
    });
  }
}
