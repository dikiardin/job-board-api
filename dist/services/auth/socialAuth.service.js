"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAuthService = void 0;
const createToken_1 = require("../../utils/createToken");
const userProvider_repository_1 = require("../../repositories/user/userProvider.repository");
const google_1 = require("./google");
const createCompany_service_1 = require("../company/createCompany.service");
const createEmployment_service_1 = require("../employment/createEmployment.service");
const user_repository_1 = require("../../repositories/user/user.repository");
const profileCompletion_1 = require("../../utils/profileCompletion");
class SocialAuthService {
    static async socialLogin(provider, token, role) {
        let profile;
        if (provider === "GOOGLE") {
            profile = await (0, google_1.verifyGoogleToken)(token);
        }
        else {
            throw { status: 400, message: "Unsupported provider" };
        }
        if (!profile) {
            throw { status: 400, message: "Failed to verify social profile" };
        }
        let userProvider = await userProvider_repository_1.UserProviderRepo.findByProvider(provider, profile.providerId);
        let user;
        if (userProvider) {
            user = userProvider.user;
            if (!user.profilePicture && profile.picture) {
                user = await userProvider_repository_1.UserProviderRepo.updateProfilePicture(user.id, profile.picture);
            }
        }
        else {
            const existing = await user_repository_1.UserRepo.findByEmail(profile.email);
            if (existing) {
                user = existing;
                if (!user.profilePicture && profile.picture) {
                    user = await userProvider_repository_1.UserProviderRepo.updateProfilePicture(user.id, profile.picture);
                }
            }
            else {
                user = await userProvider_repository_1.UserProviderRepo.createUserWithProvider({
                    name: profile.name,
                    email: profile.email,
                    provider,
                    providerId: profile.providerId,
                    role,
                    profilePicture: profile.picture ?? null,
                });
                if (role === "ADMIN") {
                    await createCompany_service_1.CreateCompanyService.createCompanyForAdmin(user.id, profile.name, profile.email);
                }
                if (role === "USER") {
                    await createEmployment_service_1.CreateEmploymentService.createForNewUser(user.id);
                }
            }
        }
        const extendedUser = (await user_repository_1.UserRepo.findWithCompany(user.id)) ?? { ...user, ownedCompany: null };
        const jwtToken = (0, createToken_1.createToken)({ userId: user.id, role: user.role }, "7d");
        return {
            ...user,
            token: jwtToken,
            isProfileComplete: (0, profileCompletion_1.resolveIsProfileComplete)(extendedUser),
        };
    }
}
exports.SocialAuthService = SocialAuthService;
//# sourceMappingURL=socialAuth.service.js.map