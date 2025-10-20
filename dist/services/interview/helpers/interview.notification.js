"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInterviewEmails = sendInterviewEmails;
const interviewEmail_service_1 = require("../interviewEmail.service");
async function sendInterviewEmails(interview, type) {
    const candidateEmail = interview.application.user.email;
    const candidateName = interview.application.user.name;
    const jobTitle = interview.application.job.title;
    const companyName = interview.application.job.company.name;
    const adminEmail = interview.application.job.company.owner?.email || undefined;
    const adminName = interview.application.job.company.owner?.name || null;
    await interviewEmail_service_1.InterviewEmailService.sendCandidateEmail({
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
        await interviewEmail_service_1.InterviewEmailService.sendAdminEmail({
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
