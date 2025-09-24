import cron from "node-cron";
import { InterviewRepository } from "../repositories/interview/interview.repository";
import { InterviewEmailService } from "../services/interview/interviewEmail.service";

export function startInterviewJobs() {
  // Runs every hour to catch interviews happening ~24 hours later
  cron.schedule("0 * * * *", async () => {
    try {
      const now = new Date();
      const windowStart = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24h
      const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000); // +25h

      const due = (await InterviewRepository.getDueReminders(windowStart, windowEnd)) as any[];
      for (const it of due) {
        const candidateEmail = (it as any).application.user.email as string;
        const candidateName = (it as any).application.user.name as string;
        const jobTitle = (it as any).application.job.title as string;
        const companyName = (it as any).application.job.company.name as string;
        const adminEmail = ((it as any).application.job.company.admin?.email as string) || undefined;
        const adminName = ((it as any).application.job.company.admin?.name as string) || null;

        await InterviewEmailService.sendCandidateEmail({
          type: "reminder",
          to: candidateEmail,
          candidateName,
          adminName,
          jobTitle,
          companyName,
          scheduleDate: new Date((it as any).scheduleDate),
          locationOrLink: ((it as any).locationOrLink as string | null) ?? null,
          notes: ((it as any).notes as string | null) ?? null,
        });

        if (adminEmail) {
          await InterviewEmailService.sendAdminEmail({
            type: "reminder",
            to: adminEmail,
            adminName: adminName || "Admin",
            candidateName,
            jobTitle,
            companyName,
            scheduleDate: new Date((it as any).scheduleDate),
            locationOrLink: ((it as any).locationOrLink as string | null) ?? null,
            notes: ((it as any).notes as string | null) ?? null,
          });
        }

        await InterviewRepository.markReminderSent((it as any).id as number);
      }

      if (due.length > 0) console.log(`[CRON] Interview reminders sent: ${due.length}`);
    } catch (error) {
      console.error("[CRON] Interview reminder job failed:", error);
    }
  });

  console.log("[CRON] Interview jobs started");
}
