"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const hashPassword_1 = require("../utils/hashPassword");
const comparePassword_1 = require("../utils/comparePassword");
const createToken_1 = require("../utils/createToken");
const customError_1 = require("../utils/customError");
const decodeToken_1 = require("../utils/decodeToken");
const nodemailer_1 = require("../config/nodemailer");
const emailTemplates_1 = require("../utils/emailTemplates");
const userProvider_repository_1 = require("../repositories/userProvider.repository");
const google_1 = require("./social/google");
const apple_1 = require("./social/apple");
const microsoft_1 = require("./social/microsoft");
class AuthService {
    static async register(role, name, email, password, phone) {
        // check existing
        const existing = await user_repository_1.UserRepo.findByEmail(email);
        if (existing) {
            throw new customError_1.CustomError("Email already in use", 409);
        }
        const passwordHash = await (0, hashPassword_1.hashPassword)(password);
        // role-specific checks
        if (role === "ADMIN" && !phone) {
            throw new customError_1.CustomError("Phone number is required for Admin", 400);
        }
        const user = await user_repository_1.UserRepo.createUser({
            name,
            email,
            passwordHash,
            role,
            ...(phone ? { phone } : {}),
        });
        // verification token
        const token = (0, createToken_1.createToken)({ userId: user.id, email: user.email }, "1h");
        try {
            await nodemailer_1.transport.sendMail({
                from: process.env.MAIL_SENDER,
                to: email,
                subject: "Workoo | Verify your account",
                html: (0, emailTemplates_1.buildVerificationEmail)(name, token),
            });
        }
        catch (err) {
            throw new customError_1.CustomError("Failed to send verification email", 500);
        }
        return { message: "Registered successfully, please verify your email." };
    }
    static async verifyEmail(token) {
        const decoded = (0, decodeToken_1.decodeToken)(token);
        if (!decoded?.userId) {
            throw new customError_1.CustomError("Invalid verification link", 400);
        }
        const user = await user_repository_1.UserRepo.findById(decoded.userId);
        if (!user) {
            throw new customError_1.CustomError("User not found", 404);
        }
        if (user.isVerified) {
            return { message: "User already verified", user };
        }
        const updatedUser = await user_repository_1.UserRepo.verifyUser(decoded.userId);
        return { message: "Email verified successfully", user: updatedUser };
    }
    static async login(email, password) {
        const user = await user_repository_1.UserRepo.findByEmail(email);
        if (!user)
            throw new Error("Invalid credentials");
        const isMatch = await (0, comparePassword_1.comparePassword)(password, user.passwordHash);
        if (!isMatch)
            throw new Error("Invalid credentials");
        if (!user.isVerified) {
            throw new Error("Please verify your email before logging in");
        }
        // issue auth token
        const token = (0, createToken_1.createToken)({ userId: user.id, role: user.role }, "7d");
        return { token, user };
    }
    static async keepLogin(userId) {
        const user = await user_repository_1.UserRepo.findById(userId);
        if (!user)
            throw new customError_1.CustomError("Account not found", 404);
        // generate fresh token
        const newToken = (0, createToken_1.createToken)({ userId: user.id, role: user.role }, "7d");
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            token: newToken,
        };
    }
    static async socialLogin(provider, token) {
        let profile;
        if (provider === "GOOGLE")
            profile = await (0, google_1.verifyGoogleToken)(token);
        if (provider === "APPLE")
            profile = await (0, apple_1.verifyAppleToken)(token);
        if (provider === "MICROSOFT")
            profile = await (0, microsoft_1.verifyMicrosoftToken)(token);
        let userProvider = await userProvider_repository_1.UserProviderRepo.findByProvider(provider, profile.providerId);
        let user;
        if (!userProvider) {
            user = await userProvider_repository_1.UserProviderRepo.createUserWithProvider({
                name: profile.name,
                email: profile.email,
                provider,
                providerId: profile.providerId,
            });
        }
        else {
            user = userProvider.user;
        }
        const jwtToken = (0, createToken_1.createToken)({ userId: user.id, role: user.role }, "7d");
        return { ...user, token: jwtToken };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map