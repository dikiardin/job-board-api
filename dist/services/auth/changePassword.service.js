"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordService = void 0;
const user_repository_1 = require("../../repositories/user/user.repository");
const customError_1 = require("../../utils/customError");
const comparePassword_1 = require("../../utils/comparePassword");
const hashPassword_1 = require("../../utils/hashPassword");
class ChangePasswordService {
    static async changePassword(userId, oldPassword, newPassword, confirmPassword) {
        const user = await user_repository_1.UserRepo.findByIdWithPassword(userId);
        if (!user)
            throw new customError_1.CustomError("User not found", 404);
        if (!user.passwordHash) {
            throw new customError_1.CustomError("Password change not allowed for Google sign-in users", 400);
        }
        const isMatch = await (0, comparePassword_1.comparePassword)(oldPassword, user.passwordHash);
        if (!isMatch)
            throw new customError_1.CustomError("Old password is incorrect", 400);
        if (newPassword !== confirmPassword) {
            throw new customError_1.CustomError("New password and confirm password do not match", 400);
        }
        const newHash = await (0, hashPassword_1.hashPassword)(newPassword);
        await user_repository_1.UserRepo.updatePassword(user.id, newHash);
        return { message: "Password changed successfully" };
    }
}
exports.ChangePasswordService = ChangePasswordService;
