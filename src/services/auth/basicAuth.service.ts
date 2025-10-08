import { UserRepo } from "../../repositories/user/user.repository";
import { hashPassword } from "../../utils/hashPassword";
import { comparePassword } from "../../utils/comparePassword";
import { createToken, verifyToken } from "../../utils/createToken";
import { CustomError } from "../../utils/customError";
import { decodeToken } from "../../utils/decodeToken";
import { transport } from "../../config/nodemailer";
import { buildVerificationEmail } from "../../utils/emailTemplateVerify";
import { CreateEmploymentService } from "../employment/createEmployment.service";
import { CreateCompanyService } from "../company/createCompany.service";
import { EmailService } from "./resendEmail.service";
import { Buffer } from "buffer";

export class BasicAuthService {
  public static async register(
    role: "USER" | "ADMIN",
    name: string,
    email: string,
    password: string
  ) {
    const existing = await UserRepo.findByEmail(email);
    if (existing) {
      throw new CustomError("Email already in use", 409);
    }

    const passwordHash = await hashPassword(password);

    const user = await UserRepo.createUser({
      name,
      email,
      passwordHash,
      role,
    });

    if (role === "ADMIN") {
      await CreateCompanyService.createCompanyForAdmin(user.id, name, email);
    }

    if (role === "USER") {
      await CreateEmploymentService.createForNewUser(user.id);
    }

    const token = createToken({ userId: user.id, email: user.email }, "1h");

    try {
      await transport.sendMail({
        from: process.env.MAIL_SENDER,
        to: email,
        subject: "Workoo | Verify your account",
        html: buildVerificationEmail(name, token),
      });
    } catch (err) {
      console.error("Nodemailer Error:", err);
      throw new CustomError("Failed to send verification email", 500);
    }

    return { message: "Registered successfully, please verify your email." };
  }

  public static async verifyEmail(token: string) {
    try {
      const decoded = verifyToken(token);

      if (!decoded?.userId) {
        throw new CustomError("Invalid verification link", 400);
      }

      const user = await UserRepo.findById(decoded.userId);
      if (!user) {
        throw new CustomError("User not found", 404);
      }

      if (user.emailVerifiedAt) {
        const jwt = createToken(
          { userId: user.id, email: user.email, role: user.role },
          "7d"
        );
        return { message: "User already verified", token: jwt, user };
      }

      const updatedUser = await UserRepo.verifyUser(decoded.userId);

      const jwt = createToken(
        {
          userId: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
        },
        "7d"
      );

      return {
        message: "Email verified successfully",
        token: jwt,
        user: updatedUser,
      };
    } catch (err: any) {
      // detect expired link
      if (err.name === "TokenExpiredError") {
        return {
          message: "Expired verification link",
          status: "expired",
        };
      }

      throw err;
    }
  }

  public static async resendVerificationEmail(email: string) {
    const user = await UserRepo.findByEmail(email);
    if (!user) throw new CustomError("User not found", 404);

    if (user.emailVerifiedAt) {
      throw new CustomError("User already verified", 400);
    }

    const newToken = createToken(
      { userId: user.id, email: user.email, role: user.role },
      "1h"
    );

    await EmailService.sendVerificationEmail(
      user.name ?? "there",
      user.email,
      newToken
    );

    return {
      message: "New verification email sent successfully",
    };
  }

  public static async login(email: string, password: string) {
    const user = await UserRepo.findByEmail(email);
    if (!user) throw new CustomError("Email is not registered", 400);

    if (!user.passwordHash) {
      throw new CustomError(
        "This account uses social login. Please sign in with Google.",
        400
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) throw new CustomError("Wrong password", 400);

    if (!user.emailVerifiedAt) {
      throw new CustomError("Please verify your email before logging in", 400);
    }

    const token = createToken({ userId: user.id, role: user.role }, "7d");
    return { token, user };
  }
}
