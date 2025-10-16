"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCompanyRepository = void 0;
const prisma_1 = require("../../config/prisma");
class GetCompanyRepository {
    static async getAllCompanies({ page, limit, keyword, city, sort = "name", order = "asc", }) {
        const skip = (page - 1) * limit;
        const where = {};
        if (keyword)
            where.name = { contains: keyword, mode: "insensitive" };
        if (city)
            where.locationCity = { contains: city, mode: "insensitive" };
        const companiesRaw = await prisma_1.prisma.company.findMany({
            where,
            skip,
            take: limit,
            select: {
                id: true,
                slug: true,
                name: true,
                description: true,
                website: true,
                locationCity: true,
                locationProvince: true,
                logoUrl: true,
                socials: true,
                bannerUrl: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        jobs: { where: { isPublished: true } },
                    },
                },
                jobs: {
                    where: { isPublished: true },
                    select: { id: true },
                },
            },
        });
        // Count published jobs for sorting
        const companies = companiesRaw.map((c) => ({
            ...c,
            jobsCount: c.jobs.length,
        }));
        companies.sort((a, b) => {
            if (sort === "jobsCount") {
                return order === "asc"
                    ? a.jobsCount - b.jobsCount
                    : b.jobsCount - a.jobsCount;
            }
            else {
                return order === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            }
        });
        const total = await prisma_1.prisma.company.count({ where });
        return { data: companies, total };
    }
    static async getCompanyBySlug(slug) {
        return prisma_1.prisma.company.findUnique({
            where: { slug },
            select: {
                id: true,
                slug: true,
                name: true,
                phone: true,
                email: true,
                address: true,
                description: true,
                website: true,
                locationCity: true,
                locationProvince: true,
                logoUrl: true,
                socials: true,
                bannerUrl: true,
                createdAt: true,
                updatedAt: true,
                jobs: {
                    where: { isPublished: true },
                    select: {
                        id: true,
                        slug: true,
                        title: true,
                        city: true,
                        category: true,
                        salaryMin: true,
                        salaryMax: true,
                        tags: true,
                        bannerUrl: true,
                        applyDeadline: true,
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });
    }
}
exports.GetCompanyRepository = GetCompanyRepository;
