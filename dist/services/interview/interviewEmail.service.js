"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewEmailService = void 0;
const nodemailer_1 = require("../../config/nodemailer");
const emailTemplateInterview_1 = require("../../utils/emailTemplateInterview");
class InterviewEmailService {
    static async sendCandidateEmail(params) {
        const base = {
            type: params.type,
            candidateName: params.candidateName,
            jobTitle: params.jobTitle,
            companyName: params.companyName,
            scheduleDate: params.scheduleDate,
        };
        if (params.adminName !== undefined)
            base.adminName = params.adminName;
        if (params.locationOrLink !== undefined)
            base.locationOrLink = params.locationOrLink;
        if (params.notes !== undefined)
            base.notes = params.notes;
        const html = (0, emailTemplateInterview_1.buildInterviewEmail)(base);
        const subjectMap = {
            created: `Interview Scheduled - ${params.jobTitle}`,
            updated: `Interview Rescheduled - ${params.jobTitle}`,
            cancelled: `Interview Cancelled - ${params.jobTitle}`,
            reminder: `Reminder: Interview Tomorrow - ${params.jobTitle}`,
        };
        await nodemailer_1.transport.sendMail({
            from: process.env.MAIL_SENDER,
            to: params.to,
            subject: subjectMap[params.type],
            html,
        });
    }
    static async sendAdminEmail(params) {
        // Reuse candidate template, swapping names for clarity
        const base = {
            type: params.type,
            candidateName: params.adminName,
            adminName: params.candidateName,
            jobTitle: params.jobTitle,
            companyName: params.companyName,
            scheduleDate: params.scheduleDate,
        };
        if (params.locationOrLink !== undefined)
            base.locationOrLink = params.locationOrLink;
        if (params.notes !== undefined)
            base.notes = params.notes;
        const html = (0, emailTemplateInterview_1.buildInterviewEmail)(base);
        const subjectMap = {
            created: `New Interview Scheduled - ${params.jobTitle}`,
            updated: `Interview Rescheduled - ${params.jobTitle}`,
            cancelled: `Interview Cancelled - ${params.jobTitle}`,
            reminder: `Reminder: Interview Tomorrow - ${params.jobTitle}`,
        };
        await nodemailer_1.transport.sendMail({
            from: process.env.MAIL_SENDER,
            to: params.to,
            subject: subjectMap[params.type],
            html,
        });
    }
}
exports.InterviewEmailService = InterviewEmailService;
//# sourceMappingURL=interviewEmail.service.js.map