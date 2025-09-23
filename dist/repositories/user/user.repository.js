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
            data: { isVerified: true },
        });
    }
}
exports.UserRepo = UserRepo;
//# sourceMappingURL=user.repository.js.map