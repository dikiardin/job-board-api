"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRepo = void 0;
const prisma_1 = require("../../config/prisma");
class CompanyRepo {
    static async findByAdminId(adminId) {
        return prisma_1.prisma.company.findFirst({
            where: { adminId },
        });
    }
    static async updateCompany(companyId, data) {
        const id = typeof companyId === 'string' ? Number(companyId) : companyId;
        return prisma_1.prisma.company.update({
            where: { id },
            data,
        });
    }
}
exports.CompanyRepo = CompanyRepo;
//# sourceMappingURL=company.repository.js.map