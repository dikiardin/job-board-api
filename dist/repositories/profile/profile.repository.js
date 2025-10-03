"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRepository = void 0;
const prisma_1 = require("../../config/prisma");
class ProfileRepository {
    static async getUserProfile(userId) {
        return prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                role: true,
                name: true,
                email: true,
                phone: true,
                gender: true,
                dob: true,
                education: true,
                address: true,
                city: true,
                profilePicture: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    static async getCompanyProfile(adminId) {
        return prisma_1.prisma.company.findUnique({
            where: { adminId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                location: true,
                city: true,
                description: true,
                website: true,
                logo: true,
                adminId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}
exports.ProfileRepository = ProfileRepository;
//# sourceMappingURL=profile.repository.js.map