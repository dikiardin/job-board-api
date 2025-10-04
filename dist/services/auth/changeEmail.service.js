"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeEmailService = void 0;
const user_repository_1 = require("../../repositories/user/user.repository");
const nodemailer_1 = require("../../config/nodemailer");
const createToken_1 = require("../../utils/createToken");
const customError_1 = require("../../utils/customError");
const emailTemplateVerifyEmailChange_1 = require("../../utils/emailTemplateVerifyEmailChange");
class ChangeEmailService {
    static async changeEmail(userId, newEmail) {
        const existing = await user_repository_1.UserRepo.findByEmail(newEmail);
        if (existing)
            throw new customError_1.CustomError("Email already in use", 409);
        await user_repository_1.UserRepo.updateUser(userId, { email: newEmail, emailVerifiedAt: null });
        // Company email is handled through the owner admin's email
        // No need to update company table as it doesn't have an email field
        const token = (0, createToken_1.createToken)({ userId, email: newEmail }, "3d");
        try {
            await nodemailer_1.transport.sendMail({
                from: process.env.MAIL_SENDER,
                to: newEmail,
                subject: "Workoo | Verify your new email",
                html: (0, emailTemplateVerifyEmailChange_1.buildVerificationEmailChange)(newEmail, token),
            });
        }
        catch (err) {
            console.error("Nodemailer Error:", err);
            throw new customError_1.CustomError("Failed to send verification email", 500);
        }
        return { message: "Email updated! Please verify your new email." };
    }
}
exports.ChangeEmailService = ChangeEmailService;
//# sourceMappingURL=changeEmail.service.js.map