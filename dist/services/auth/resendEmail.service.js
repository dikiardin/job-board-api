"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const emailTemplateVerify_1 = require("../../utils/emailTemplateVerify");
const nodemailer_1 = require("../../config/nodemailer");
class EmailService {
    static async sendEmail(to, subject, html) {
        try {
            await nodemailer_1.transport.sendMail({
                from: process.env.MAIL_SENDER,
                to,
                subject,
                html,
            });
        }
        catch (err) {
            console.error("Failed to send email:", err.message);
            throw new Error("Failed to send email");
        }
    }
    static async sendVerificationEmail(name, email, token) {
        const html = (0, emailTemplateVerify_1.buildVerificationEmail)(name, token);
        const subject = "Workoo | Verify your account";
        await this.sendEmail(email, subject, html);
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=resendEmail.service.js.map