import { transport } from "../../config/nodemailer";
import { buildInterviewEmail } from "../../utils/emailTemplateInterview";

export class InterviewEmailService {
  static async sendCandidateEmail(params: {
    type: "created" | "updated" | "cancelled" | "reminder";
    to: string;
    candidateName: string;
    adminName?: string | null;
    jobTitle: string;
    companyName: string;
    scheduleDate: Date;
    locationOrLink?: string | null;
    notes?: string | null;
  }) {
    const base: any = {
      type: params.type,
      candidateName: params.candidateName,
      jobTitle: params.jobTitle,
      companyName: params.companyName,
      scheduleDate: params.scheduleDate,
    };
    if (params.adminName !== undefined) base.adminName = params.adminName;
    if (params.locationOrLink !== undefined) base.locationOrLink = params.locationOrLink;
    if (params.notes !== undefined) base.notes = params.notes;
    const html = buildInterviewEmail(base);

    const subjectMap: Record<string, string> = {
      created: `Interview Scheduled - ${params.jobTitle}`,
      updated: `Interview Rescheduled - ${params.jobTitle}`,
      cancelled: `Interview Cancelled - ${params.jobTitle}`,
      reminder: `Reminder: Interview Tomorrow - ${params.jobTitle}`,
    };

    await transport.sendMail({
      from: process.env.MAIL_SENDER,
      to: params.to,
      subject: subjectMap[params.type],
      html,
    });
  }

  static async sendAdminEmail(params: {
    type: "created" | "updated" | "cancelled" | "reminder";
    to: string;
    adminName: string;
    candidateName: string;
    jobTitle: string;
    companyName: string;
    scheduleDate: Date;
    locationOrLink?: string | null;
    notes?: string | null;
  }) {
    // Reuse candidate template, swapping names for clarity
    const base: any = {
      type: params.type,
      candidateName: params.adminName,
      adminName: params.candidateName,
      jobTitle: params.jobTitle,
      companyName: params.companyName,
      scheduleDate: params.scheduleDate,
    };
    if (params.locationOrLink !== undefined) base.locationOrLink = params.locationOrLink;
    if (params.notes !== undefined) base.notes = params.notes;
    const html = buildInterviewEmail(base);

    const subjectMap: Record<string, string> = {
      created: `New Interview Scheduled - ${params.jobTitle}`,
      updated: `Interview Rescheduled - ${params.jobTitle}`,
      cancelled: `Interview Cancelled - ${params.jobTitle}`,
      reminder: `Reminder: Interview Tomorrow - ${params.jobTitle}`,
    };

    await transport.sendMail({
      from: process.env.MAIL_SENDER,
      to: params.to,
      subject: subjectMap[params.type],
      html,
    });
  }
}
