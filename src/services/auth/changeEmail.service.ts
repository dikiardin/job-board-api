import { UserRepo } from "../../repositories/user/user.repository";
import { transport } from "../../config/nodemailer";
import { buildVerificationEmail } from "../../utils/emailTemplateVerify";
import { createToken } from "../../utils/createToken";
import { CustomError } from "../../utils/customError";

export class ChangeEmailService {
  static async changeEmail(userId: number, newEmail: string) {
    const existing = await UserRepo.findByEmail(newEmail);
    if (existing) throw new CustomError("Email already in use", 409);

    await UserRepo.updateUser(userId, { email: newEmail, isVerified: false });

    const token = createToken({ userId, email: newEmail }, "1h");

    try {
      await transport.sendMail({
        from: process.env.MAIL_SENDER,
        to: newEmail,
        subject: "Workoo | Verify your new email",
        html: buildVerificationEmail(newEmail, token),
      });
    } catch (err) {
      console.error("Nodemailer Error:", err);
      throw new CustomError("Failed to send verification email", 500);
    }

    return { message: "Email updated! Please verify your new email." };
  }
}
