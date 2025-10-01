"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCompanyRepository = void 0;
const prisma_1 = require("../../config/prisma");
class GetCompanyRepository {
    static async getAllCompanies() {
        return prisma_1.prisma.company.findMany({
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
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        jobs: {
                            where: { isPublished: true },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    static async getCompanyById(companyId) {
        return prisma_1.prisma.company.findUnique({
            where: { id: companyId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                location: true,
                description: true,
                website: true,
                logo: true,
                createdAt: true,
                updatedAt: true,
                jobs: {
                    where: { isPublished: true },
                    select: {
                        id: true,
                        title: true,
                        city: true,
                        category: true,
                        salaryMin: true,
                        salaryMax: true,
                        tags: true,
                        banner: true,
                        deadline: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
    }
}
exports.GetCompanyRepository = GetCompanyRepository;
//# sourceMappingURL=getCompany.repository.js.map