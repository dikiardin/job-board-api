import { transport } from "../../config/nodemailer";
import { buildSubscriptionExpirationEmail } from "../../utils/emailTemplateSubscription";

export class EmailService {
  public static async sendSubscriptionExpirationEmail(
    userEmail: string,
    userName: string,
    planName: string,
    expirationDate: Date
  ) {
    const emailContent = buildSubscriptionExpirationEmail(
      userName,
      planName,
      expirationDate
    );

    const mailOptions = {
      from: process.env.MAIL_SENDER,
      to: userEmail,
      subject: "Subscription Expiring Soon - Renew Now!",
      html: emailContent,
    };

    try {
      await transport.sendMail(mailOptions);
    } catch (error) {
      console.error(`Failed to send email to ${userEmail}:`, error);
      throw error;
    }
  }

}
