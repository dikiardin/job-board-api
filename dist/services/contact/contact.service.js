"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const nodemailer_1 = require("../../config/nodemailer");
const contact_repository_1 = require("../../repositories/contact/contact.repository");
class ContactService {
    static async sendContactEmail(name, email, message) {
        // Save message (optional)
        await contact_repository_1.ContactRepository.saveContact(name, email, message);
        // Compose email
        const mailOptions = {
            from: process.env.MAIL_SENDER,
            to: "workoo.dev@gmail.com",
            subject: `New Contact Form Message from ${name}`,
            html: `
        <h2>New Message Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
        };
        // Send email
        await nodemailer_1.transport.sendMail(mailOptions);
        return { success: true, message: "Email sent successfully" };
    }
}
exports.ContactService = ContactService;
//# sourceMappingURL=contact.service.js.map