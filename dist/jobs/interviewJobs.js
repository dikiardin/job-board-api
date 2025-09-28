"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startInterviewJobs = startInterviewJobs;
const node_cron_1 = __importDefault(require("node-cron"));
const interview_repository_1 = require("../repositories/interview/interview.repository");
const interviewEmail_service_1 = require("../services/interview/interviewEmail.service");
function startInterviewJobs() {
    // Runs every 6 hours to catch interviews happening ~24 hours later
    node_cron_1.default.schedule("0 */6 * * *", async () => {
        try {
            const now = new Date();
            const windowStart = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24h
            const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000); // +25h
            const due = (await interview_repository_1.InterviewRepository.getDueReminders(windowStart, windowEnd));
            for (const it of due) {
                const candidateEmail = it.application.user.email;
                const candidateName = it.application.user.name;
                const jobTitle = it.application.job.title;
                const companyName = it.application.job.company.name;
                const adminEmail = it.application.job.company.admin?.email || undefined;
                const adminName = it.application.job.company.admin?.name || null;
                await interviewEmail_service_1.InterviewEmailService.sendCandidateEmail({
                    type: "reminder",
                    to: candidateEmail,
                    candidateName,
                    adminName,
                    jobTitle,
                    companyName,
                    scheduleDate: new Date(it.scheduleDate),
                    locationOrLink: it.locationOrLink ?? null,
                    notes: it.notes ?? null,
                });
                if (adminEmail) {
                    await interviewEmail_service_1.InterviewEmailService.sendAdminEmail({
                        type: "reminder",
                        to: adminEmail,
                        adminName: adminName || "Admin",
                        candidateName,
                        jobTitle,
                        companyName,
                        scheduleDate: new Date(it.scheduleDate),
                        locationOrLink: it.locationOrLink ?? null,
                        notes: it.notes ?? null,
                    });
                }
                await interview_repository_1.InterviewRepository.markReminderSent(it.id);
            }
            if (due.length > 0)
                console.log(`[CRON] Interview reminders sent: ${due.length}`);
        }
        catch (error) {
            console.error("[CRON] Interview reminder job failed:", error);
        }
    });
    console.log("[CRON] Interview jobs started");
}
//# sourceMappingURL=interviewJobs.js.map