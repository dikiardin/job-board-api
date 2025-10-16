"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetJobRepository = void 0;
const prisma_1 = require("../../config/prisma");
class GetJobRepository {
    static async getAllJobs(filters) {
        const { keyword, city, limit, offset, sortBy, sortOrder, postedWithin } = filters || {};
        const conditions = [];
        if (keyword) {
            conditions.push({
                OR: [
                    { title: { contains: keyword, mode: "insensitive" } },
                    { category: { contains: keyword, mode: "insensitive" } },
                    { tags: { has: keyword.toLowerCase() } },
                    {
                        company: {
                            is: { name: { contains: keyword, mode: "insensitive" } },
                        },
                    },
                ],
            });
        }
        if (city) {
            conditions.push({ city: { contains: city, mode: "insensitive" } });
        }
        if (postedWithin) {
            const days = parseInt(postedWithin, 10);
            const dateLimit = new Date();
            dateLimit.setDate(dateLimit.getDate() - days);
            conditions.push({ createdAt: { gte: dateLimit } });
        }
        return prisma_1.prisma.job.findMany({
            where: {
                isPublished: true,
                AND: conditions,
            },
            select: {
                id: true,
                slug: true,
                title: true,
                category: true,
                city: true,
                salaryMin: true,
                salaryMax: true,
                tags: true,
                company: { select: { name: true, logoUrl: true } },
                createdAt: true,
            },
            orderBy: {
                [sortBy || "createdAt"]: sortOrder || "desc",
            },
            ...(limit !== undefined ? { take: limit } : {}),
            ...(offset !== undefined ? { skip: offset } : {}),
        });
    }
    static async countJobs(filters) {
        const { keyword, city } = filters || {};
        return prisma_1.prisma.job.count({
            where: {
                isPublished: true,
                AND: [
                    keyword
                        ? {
                            OR: [
                                { title: { contains: keyword, mode: "insensitive" } },
                                { category: { contains: keyword, mode: "insensitive" } },
                                {
                                    company: {
                                        is: { name: { contains: keyword, mode: "insensitive" } },
                                    },
                                },
                            ],
                        }
                        : {},
                    city ? { city: { contains: city, mode: "insensitive" } } : {},
                ],
            },
        });
    }
    static async findBySlug(slug) {
        return prisma_1.prisma.job.findUnique({
            where: { slug },
            include: {
                company: {
                    select: {
                        id: true,
                        slug: true,
                        name: true,
                        email: true,
                        phone: true,
                        address: true,
                        website: true,
                        description: true,
                        logoUrl: true,
                        locationCity: true,
                    },
                },
            },
        });
    }
}
exports.GetJobRepository = GetJobRepository;
