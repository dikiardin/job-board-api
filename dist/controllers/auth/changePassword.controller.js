"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordController = void 0;
const changePassword_service_1 = require("../../services/auth/changePassword.service");
class ChangePasswordController {
    static async changePassword(req, res, next) {
        try {
            const userId = res.locals.decrypt.userId;
            const { oldPassword, newPassword, confirmPassword } = req.body;
            if (!oldPassword || !newPassword || !confirmPassword) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const result = await changePassword_service_1.ChangePasswordService.changePassword(userId, oldPassword, newPassword, confirmPassword);
            res.status(200).json(result);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ChangePasswordController = ChangePasswordController;
