"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeepLoginService = void 0;
const createToken_1 = require("../../utils/createToken");
const customError_1 = require("../../utils/customError");
const user_repository_1 = require("../../repositories/user/user.repository");
const profileCompletion_1 = require("../../utils/profileCompletion");
class KeepLoginService {
    static async keepLogin(userId) {
        const user = await user_repository_1.UserRepo.findWithCompany(userId);
        if (!user)
            throw new customError_1.CustomError("Account not found", 404);
        const newToken = (0, createToken_1.createToken)({ userId: user.id, role: user.role }, "7d");
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: !!user.emailVerifiedAt,
            token: newToken,
            profilePicture: user.profilePicture,
            isProfileComplete: (0, profileCompletion_1.resolveIsProfileComplete)(user),
        };
    }
}
exports.KeepLoginService = KeepLoginService;
//# sourceMappingURL=keepLogin.service.js.map