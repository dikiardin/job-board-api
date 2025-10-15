"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = require("../../config/nodemailer");
const emailTemplateSubscription_1 = require("../../utils/emailTemplateSubscription");
class EmailService {
    static async sendSubscriptionExpirationEmail(userEmail, userName, planName, expirationDate) {
        const emailContent = (0, emailTemplateSubscription_1.buildSubscriptionExpirationEmail)(userName, planName, expirationDate);
        const mailOptions = {
            from: process.env.MAIL_SENDER,
            to: userEmail,
            subject: "Subscription Expiring Soon - Renew Now!",
            html: emailContent,
        };
        try {
            await nodemailer_1.transport.sendMail(mailOptions);
        }
        catch (error) {
            console.error(`Failed to send email to ${userEmail}:`, error);
            throw error;
        }
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map