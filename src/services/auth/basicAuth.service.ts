import { UserRepo } from "../../repositories/user/user.repository";
import { hashPassword } from "../../utils/hashPassword";
import { comparePassword } from "../../utils/comparePassword";
import { createToken } from "../../utils/createToken";
import { CustomError } from "../../utils/customError";
import { decodeToken } from "../../utils/decodeToken";
import { transport } from "../../config/nodemailer";
import { buildVerificationEmail } from "../../utils/emailTemplates";
import { CreateEmploymentService } from "../employment/createEmployment.service";
import { CreateAdminService } from "../company-admin/createAdmin.service";

export class BasicAuthService {
  public static async register(
    role: "USER" | "ADMIN",
    name: string,
    email: string,
    password: string,
    phone?: string,
    companyId?: number 
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
      ...(phone ? { phone } : {}),
    });

    if (role === "ADMIN") {
      if (!companyId) {
        throw new CustomError(
          "Company ID is required for ADMIN registration",
          400
        );
      }
      await CreateAdminService.createForNewAdmin(user.id, companyId);
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
      throw new CustomError("Failed to send verification email", 500);
    }

    return { message: "Registered successfully, please verify your email." };
  }

  public static async verifyEmail(token: string) {
    const decoded: any = decodeToken(token);

    if (!decoded?.userId) {
      throw new CustomError("Invalid verification link", 400);
    }

    const user = await UserRepo.findById(decoded.userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    if (user.isVerified) {
      return { message: "User already verified", user };
    }

    const updatedUser = await UserRepo.verifyUser(decoded.userId);
    return { message: "Email verified successfully", user: updatedUser };
  }

  public static async login(email: string, password: string) {
    const user = await UserRepo.findByEmail(email);
    if (!user) throw new CustomError("Invalid credentials", 400);

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) throw new CustomError("Invalid credentials", 400);

    if (!user.isVerified) {
      throw new CustomError("Please verify your email before logging in", 400);
    }

    const token = createToken({ userId: user.id, role: user.role }, "7d");
    return { token, user };
  }
}
