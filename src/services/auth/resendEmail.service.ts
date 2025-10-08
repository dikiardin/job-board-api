import { buildVerificationEmail } from "../../utils/emailTemplateVerify";
import { transport } from "../../config/nodemailer";

export class EmailService {
  static async sendEmail(to: string, subject: string, html: string) {
    try {
      await transport.sendMail({
        from: process.env.MAIL_SENDER,
        to,
        subject,
        html,
      });
    } catch (err: any) {
      console.error("Failed to send email:", err.message);
      throw new Error("Failed to send email");
    }
  }

  static async sendVerificationEmail(
    name: string,
    email: string,
    token: string
  ) {
    const html = buildVerificationEmail(name, token);
    const subject = "Workoo | Verify your account";
    await this.sendEmail(email, subject, html);
  }
}
