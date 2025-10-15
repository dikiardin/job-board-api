"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyValidationRepository = void 0;
const prisma_1 = require("../../config/prisma");
class CompanyValidationRepository {
    // Check if company exists
    static async checkCompanyExists(companyId) {
        const id = typeof companyId === "string" ? Number(companyId) : companyId;
        if (isNaN(id)) {
            return false;
        }
        const company = await prisma_1.prisma.company.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!company;
    }
    // Get user's employment record with a company
    static async getUserEmployment(userId, companyId) {
        const cid = typeof companyId === "string" ? Number(companyId) : companyId;
        return await prisma_1.prisma.employment.findFirst({
            where: {
                userId,
                companyId: cid,
            },
            select: {
                id: true,
                startDate: true,
                endDate: true,
            },
        });
    }
    static async getUserVerifiedEmployment(userId, companyId) {
        const cid = typeof companyId === "string" ? Number(companyId) : companyId;
        return await prisma_1.prisma.employment.findFirst({
            where: {
                userId,
                companyId: cid,
                isVerified: true,
            },
            select: {
                id: true,
                positionTitle: true,
                startDate: true,
                endDate: true,
                isCurrent: true,
                createdAt: true,
                company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
}
exports.CompanyValidationRepository = CompanyValidationRepository;
//# sourceMappingURL=CompanyValidationRepository.js.map