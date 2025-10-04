import { UserRepo } from "../../repositories/user/user.repository";
import { CustomError } from "../../utils/customError";
import { hashPassword } from "../../utils/hashPassword";
import { createToken } from "../../utils/createToken";
import { decodeToken } from "../../utils/decodeToken";
import { transport } from "../../config/nodemailer";
import { buildResetPasswordEmail } from "../../utils/emailTemplateResetPass";

export class ForgotPasswordService {
  static async requestReset(email: string) {
    const user = await UserRepo.findByEmail(email);

    if (!user) throw new CustomError("Email not registered", 404);
    if (!user.passwordHash) {
      throw new CustomError(
        "This account was registered via Google. Password reset not available.",
        400
      );
    }

    const token = createToken({ userId: user.id }, "15m");

    try {
      await transport.sendMail({
        from: process.env.MAIL_SENDER,
        to: email,
        subject: "Workoo | Reset Your Password",
        html: buildResetPasswordEmail(user.name || "User", token),
      });
    } catch (err) {
      console.error("Nodemailer Error:", err);
      throw new CustomError("Failed to send reset password email", 500);
    }

    return { message: "Password reset email sent. Please check your email." };
  }

  static async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string
  ) {
    if (newPassword !== confirmPassword) {
      throw new CustomError(
        "New password and confirm password do not match",
        400
      );
    }

    let payload: any;
    try {
      payload = decodeToken(token);
    } catch (err) {
      throw new CustomError("Invalid or expired reset token", 400);
    }

    const user = await UserRepo.findById(payload.userId);
    if (!user) throw new CustomError("User not found", 404);

    const hashed = await hashPassword(newPassword);
    await UserRepo.updatePassword(user.id, hashed);

    return { message: "Password reset successfully. Please log in again." };
  }
}
