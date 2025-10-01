"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const profile_repository_1 = require("../../repositories/profile/profile.repository");
class ProfileService {
    static async getUserProfile(userId) {
        const user = await profile_repository_1.ProfileRepository.getUserProfile(userId);
        if (!user)
            throw new Error("User not found");
        return user;
    }
    static async getCompanyProfile(adminId) {
        const company = await profile_repository_1.ProfileRepository.getCompanyProfile(adminId);
        if (!company)
            throw new Error("Company not found");
        return company;
    }
}
exports.ProfileService = ProfileService;
//# sourceMappingURL=profile.service.js.map