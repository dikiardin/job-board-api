"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditProfileRepository = void 0;
const prisma_1 = require("../../config/prisma");
class EditProfileRepository {
    static async updateUserProfile(userId, data) {
        return prisma_1.prisma.user.update({
            where: { id: userId },
            data,
        });
    }
    static async updateCompanyProfile(adminId, data) {
        return prisma_1.prisma.company.update({
            where: { adminId: adminId },
            data,
        });
    }
    static async findUserById(userId) {
        return prisma_1.prisma.user.findUnique({ where: { id: userId } });
    }
}
exports.EditProfileRepository = EditProfileRepository;
//# sourceMappingURL=editProfile.repository.js.map