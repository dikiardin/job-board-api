"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordService = void 0;
const user_repository_1 = require("../../repositories/user/user.repository");
const customError_1 = require("../../utils/customError");
const hashPassword_1 = require("../../utils/hashPassword");
const createToken_1 = require("../../utils/createToken");
const decodeToken_1 = require("../../utils/decodeToken");
const nodemailer_1 = require("../../config/nodemailer");
const emailTemplateResetPass_1 = require("../../utils/emailTemplateResetPass");
class ForgotPasswordService {
    static async requestReset(email) {
        const user = await user_repository_1.UserRepo.findByEmail(email);
        if (!user)
            throw new customError_1.CustomError("Email not registered", 404);
        if (!user.passwordHash) {
            throw new customError_1.CustomError("This account was registered via Google. Password reset not available.", 400);
        }
        const token = (0, createToken_1.createToken)({ userId: user.id }, "15m");
        try {
            await nodemailer_1.transport.sendMail({
                from: process.env.MAIL_SENDER,
                to: email,
                subject: "Workoo | Reset Your Password",
                html: (0, emailTemplateResetPass_1.buildResetPasswordEmail)(user.name, token),
            });
        }
        catch (err) {
            console.error("Nodemailer Error:", err);
            throw new customError_1.CustomError("Failed to send reset password email", 500);
        }
        return { message: "Password reset email sent. Please check your inbox." };
    }
    static async resetPassword(token, newPassword, confirmPassword) {
        if (newPassword !== confirmPassword) {
            throw new customError_1.CustomError("New password and confirm password do not match", 400);
        }
        let payload;
        try {
            payload = (0, decodeToken_1.decodeToken)(token);
        }
        catch (err) {
            throw new customError_1.CustomError("Invalid or expired reset token", 400);
        }
        const user = await user_repository_1.UserRepo.findById(payload.userId);
        if (!user)
            throw new customError_1.CustomError("User not found", 404);
        const hashed = await (0, hashPassword_1.hashPassword)(newPassword);
        await user_repository_1.UserRepo.updatePassword(user.id, hashed);
        return { message: "Password reset successfully. Please log in again." };
    }
}
exports.ForgotPasswordService = ForgotPasswordService;
//# sourceMappingURL=forgotPassword.service.js.map