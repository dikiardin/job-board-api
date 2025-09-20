import { UserRepo } from "../repositories/user.repository";
import { hashPassword } from "../utils/hashPassword";
import { comparePassword } from "../utils/comparePassword";
import { createToken } from "../utils/createToken";
import { CustomError } from "../utils/customError";
import { decodeToken } from "../utils/decodeToken";
import { transport } from "../config/nodemailer";
import { buildVerificationEmail } from "../utils/emailTemplates";

export class AuthService {
  public static async register(
    role: "USER" | "ADMIN",
    name: string,
    email: string,
    password: string,
    phone?: string
  ) {
    // check existing
    const existing = await UserRepo.findByEmail(email);
    if (existing) {
      throw new CustomError("Email already in use", 409);
    }

    const passwordHash = await hashPassword(password);

    // role-specific checks
    if (role === "ADMIN" && !phone) {
      throw new CustomError("Phone number is required for Admin", 400);
    }

    const user = await UserRepo.createUser({
      name,
      email,
      passwordHash,
      role,
      ...(phone ? { phone } : {}),
    });
    // verification token
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
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) throw new Error("Invalid credentials");

    if (!user.isVerified) {
      throw new Error("Please verify your email before logging in");
    }

    // issue auth token
    const token = createToken({ userId: user.id, role: user.role }, "7d");
    return { token, user };
  }

  public static async keepLogin(userId: number) {
    const user = await UserRepo.findById(userId);
    if (!user) throw new CustomError("Account not found", 404);

    // generate fresh token
    const newToken = createToken({ userId: user.id, role: user.role }, "7d");

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token: newToken,
    };
  }
}
