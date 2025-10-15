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
                emailVerifiedAt: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    static async getCompanyProfile(ownerAdminId) {
        return prisma_1.prisma.company.findUnique({
            where: { ownerAdminId },
            select: {
                id: true,
                slug: true,
                name: true,
                email: true,
                phone: true,
                description: true,
                website: true,
                locationCity: true,
                locationProvince: true,
                locationCountry: true,
                address: true,
                logoUrl: true,
                bannerUrl: true,
                socials: true,
                ownerAdminId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}
exports.ProfileRepository = ProfileRepository;
//# sourceMappingURL=profile.repository.js.map