import { transport } from "../../config/nodemailer";
import { ContactRepository } from "../../repositories/contact/contact.repository";


export class ContactService {
  static async sendContactEmail(name: string, email: string, message: string) {
    // Save message (optional)
    await ContactRepository.saveContact(name, email, message);

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
    await transport.sendMail(mailOptions);

    return { success: true, message: "Email sent successfully" };
  }
}
