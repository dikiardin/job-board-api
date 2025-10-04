"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRepo = void 0;
const prisma_1 = require("../../config/prisma");
class CompanyRepo {
    static async findByAdminId(adminId) {
        return prisma_1.prisma.company.findFirst({
            where: { ownerAdminId: adminId },
        });
    }
    static async updateCompany(companyId, data) {
        const id = typeof companyId === "string" ? Number(companyId) : companyId;
        return prisma_1.prisma.company.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.locationCity !== undefined && { locationCity: data.locationCity }),
                ...(data.locationProvince !== undefined && { locationProvince: data.locationProvince }),
                ...(data.website !== undefined && { website: data.website }),
                ...(data.socials !== undefined && { socials: data.socials }),
                ...(data.bannerUrl !== undefined && { bannerUrl: data.bannerUrl }),
                ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
            },
        });
    }
}
exports.CompanyRepo = CompanyRepo;
//# sourceMappingURL=company.repository.js.map