"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepo = void 0;
const prisma_1 = require("../../config/prisma");
class UserRepo {
    static async createUser(data) {
        return prisma_1.prisma.user.create({
            data,
        });
    }
    static async findByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    }
    static async findById(id) {
        return prisma_1.prisma.user.findUnique({ where: { id } });
    }
    static async verifyUser(id) {
        return prisma_1.prisma.user.update({
            where: { id },
            data: { emailVerifiedAt: new Date() },
        });
    }
    static async updateUser(id, data) {
        return prisma_1.prisma.user.update({
            where: { id },
            data,
        });
    }
    static async findByIdWithPassword(id) {
        return prisma_1.prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true, passwordHash: true },
        });
    }
    static async updatePassword(id, passwordHash) {
        return prisma_1.prisma.user.update({
            where: { id },
            data: { passwordHash },
        });
    }
}
exports.UserRepo = UserRepo;
//# sourceMappingURL=user.repository.js.map