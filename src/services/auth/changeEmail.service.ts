import { UserRepo } from "../../repositories/user/user.repository";
import { transport } from "../../config/nodemailer";
import { createToken } from "../../utils/createToken";
import { CustomError } from "../../utils/customError";
import { buildVerificationEmailChange } from "../../utils/emailTemplateVerifyEmailChange";
import { CompanyRepo } from "../../repositories/company/company.repository";

export class ChangeEmailService {
  static async changeEmail(userId: number, newEmail: string) {
    const existing = await UserRepo.findByEmail(newEmail);
    if (existing) throw new CustomError("Email already in use", 409);

    const user = await UserRepo.findWithCompany(userId);
    if (!user) throw new CustomError("User not found", 404);

    await UserRepo.updateUser(userId, {
      email: newEmail,
      emailVerifiedAt: null,
    });

    if (user.role === "ADMIN" && user.ownedCompany) {
      await CompanyRepo.updateCompany(user.ownedCompany.id, {
        email: newEmail,
      });
    }

    const token = createToken({ userId, email: newEmail }, "3d");

    try {
      await transport.sendMail({
        from: process.env.MAIL_SENDER,
        to: newEmail,
        subject: "Workoo | Verify your new email",
        html: buildVerificationEmailChange(newEmail, token),
      });
    } catch (err) {
      console.error("Nodemailer Error:", err);
      throw new CustomError("Failed to send verification email", 500);
    }

    return { message: "Email updated! Please verify your new email." };
  }
}
