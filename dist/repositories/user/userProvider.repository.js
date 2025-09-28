"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProviderRepo = void 0;
const prisma_1 = require("../../config/prisma");
class UserProviderRepo {
    static async findByProvider(provider, providerId) {
        return prisma_1.prisma.userProvider.findUnique({
            where: { provider_providerId: { provider, providerId } },
            include: { user: true },
        });
    }
    static async createUserWithProvider(data) {
        return prisma_1.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: null,
                role: data.role,
                isVerified: true,
                profilePicture: data.profilePicture ?? null,
                providers: {
                    create: {
                        provider: data.provider,
                        providerId: data.providerId,
                    },
                },
            },
            include: { providers: true },
        });
    }
    static async updateProfilePicture(userId, profilePicture) {
        return prisma_1.prisma.user.update({
            where: { id: userId },
            data: { profilePicture },
        });
    }
}
exports.UserProviderRepo = UserProviderRepo;
//# sourceMappingURL=userProvider.repository.js.map