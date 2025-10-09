"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicAuthService = void 0;
const user_repository_1 = require("../../repositories/user/user.repository");
const hashPassword_1 = require("../../utils/hashPassword");
const comparePassword_1 = require("../../utils/comparePassword");
const createToken_1 = require("../../utils/createToken");
const customError_1 = require("../../utils/customError");
const nodemailer_1 = require("../../config/nodemailer");
const emailTemplateVerify_1 = require("../../utils/emailTemplateVerify");
const createEmployment_service_1 = require("../employment/createEmployment.service");
const createCompany_service_1 = require("../company/createCompany.service");
const resendEmail_service_1 = require("./resendEmail.service");
class BasicAuthService {
    static async register(role, name, email, password) {
        const existing = await user_repository_1.UserRepo.findByEmail(email);
        if (existing) {
            throw new customError_1.CustomError("Email already in use", 409);
        }
        const passwordHash = await (0, hashPassword_1.hashPassword)(password);
        const user = await user_repository_1.UserRepo.createUser({
            name,
            email,
            passwordHash,
            role,
        });
        if (role === "ADMIN") {
            await createCompany_service_1.CreateCompanyService.createCompanyForAdmin(user.id, name, email);
        }
        if (role === "USER") {
            await createEmployment_service_1.CreateEmploymentService.createForNewUser(user.id);
        }
        const token = (0, createToken_1.createToken)({ userId: user.id, email: user.email }, "1h");
        try {
            await nodemailer_1.transport.sendMail({
                from: process.env.MAIL_SENDER,
                to: email,
                subject: "Workoo | Verify your account",
                html: (0, emailTemplateVerify_1.buildVerificationEmail)(name, token),
            });
        }
        catch (err) {
            console.error("Nodemailer Error:", err);
            throw new customError_1.CustomError("Failed to send verification email", 500);
        }
        return { message: "Registered successfully, please verify your email." };
    }
    static async verifyEmail(token) {
        try {
            const decoded = (0, createToken_1.verifyToken)(token);
            if (!decoded?.userId) {
                throw new customError_1.CustomError("Invalid verification link", 400);
            }
            const user = await user_repository_1.UserRepo.findById(decoded.userId);
            if (!user) {
                throw new customError_1.CustomError("User not found", 404);
            }
            if (user.emailVerifiedAt) {
                const jwt = (0, createToken_1.createToken)({ userId: user.id, email: user.email, role: user.role }, "7d");
                return { message: "User already verified", token: jwt, user };
            }
            const updatedUser = await user_repository_1.UserRepo.verifyUser(decoded.userId);
            const jwt = (0, createToken_1.createToken)({
                userId: updatedUser.id,
                email: updatedUser.email,
                role: updatedUser.role,
            }, "7d");
            return {
                message: "Email verified successfully",
                token: jwt,
                user: updatedUser,
            };
        }
        catch (err) {
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
    static async resendVerificationEmail(email) {
        const user = await user_repository_1.UserRepo.findByEmail(email);
        if (!user)
            throw new customError_1.CustomError("User not found", 404);
        if (user.emailVerifiedAt) {
            throw new customError_1.CustomError("User already verified", 400);
        }
        const newToken = (0, createToken_1.createToken)({ userId: user.id, email: user.email, role: user.role }, "1h");
        await resendEmail_service_1.EmailService.sendVerificationEmail(user.name ?? "there", user.email, newToken);
        return {
            message: "New verification email sent successfully",
        };
    }
    static async login(email, password) {
        const user = await user_repository_1.UserRepo.findByEmail(email);
        if (!user)
            throw new customError_1.CustomError("Email is not registered", 400);
        if (!user.passwordHash) {
            throw new customError_1.CustomError("This account uses social login. Please sign in with Google.", 400);
        }
        const isMatch = await (0, comparePassword_1.comparePassword)(password, user.passwordHash);
        if (!isMatch)
            throw new customError_1.CustomError("Wrong password", 400);
        if (!user.emailVerifiedAt) {
            throw new customError_1.CustomError("Please verify your email before logging in", 400);
        }
        const token = (0, createToken_1.createToken)({ userId: user.id, role: user.role }, "7d");
        return { token, user };
    }
}
exports.BasicAuthService = BasicAuthService;
//# sourceMappingURL=basicAuth.service.js.map