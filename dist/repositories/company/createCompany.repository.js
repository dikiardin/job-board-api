"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCompanyRepo = void 0;
const prisma_1 = require("../../config/prisma");
class CreateCompanyRepo {
    static async createCompany(data) {
        return prisma_1.prisma.company.create({ data });
    }
    static async findByAdminId(adminId) {
        return prisma_1.prisma.company.findUnique({ where: { adminId } });
    }
}
exports.CreateCompanyRepo = CreateCompanyRepo;
//# sourceMappingURL=createCompany.repository.js.map