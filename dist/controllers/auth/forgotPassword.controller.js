"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordController = void 0;
const forgotPassword_service_1 = require("../../services/auth/forgotPassword.service");
class ForgotPasswordController {
    static async requestReset(req, res, next) {
        try {
            const { email } = req.body;
            const result = await forgotPassword_service_1.ForgotPasswordService.requestReset(email);
            res.status(200).json(result);
        }
        catch (err) {
            next(err);
        }
    }
    static async resetPassword(req, res, next) {
        try {
            const { token } = req.params;
            const { newPassword, confirmPassword } = req.body;
            if (!token) {
                return res.status(400).json({ message: "Reset token is required" });
            }
            const result = await forgotPassword_service_1.ForgotPasswordService.resetPassword(token, newPassword, confirmPassword);
            res.status(200).json(result);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ForgotPasswordController = ForgotPasswordController;
