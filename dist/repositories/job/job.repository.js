"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRepository = void 0;
const prisma_1 = require("../../config/prisma");
class JobRepository {
    static async getCompany(companyId) {
        return prisma_1.prisma.company.findUnique({ where: { id: companyId } });
    }
    static async createJob(companyId, data) {
        return prisma_1.prisma.job.create({
            data: {
                companyId,
                title: data.title,
                description: data.description,
                banner: data.banner ?? null,
                category: data.category,
                city: data.city,
                salaryMin: data.salaryMin ?? null,
                salaryMax: data.salaryMax ?? null,
                tags: data.tags,
                deadline: data.deadline ?? null,
                isPublished: data.isPublished ?? false,
            },
        });
    }
    static async updateJob(companyId, jobId, data) {
        return prisma_1.prisma.job.update({
            where: { id: jobId },
            data: {
                ...data,
            },
        });
    }
    static async getJobById(companyId, jobId) {
        return prisma_1.prisma.job.findFirst({
            where: { id: jobId, companyId },
            include: {
                _count: { select: { applications: true } },
                applications: {
                    include: {
                        user: true,
                    },
                },
                preselectionTests: {
                    include: {
                        results: true,
                    },
                },
            },
        });
    }
    static async togglePublish(jobId, isPublished) {
        return prisma_1.prisma.job.update({ where: { id: jobId }, data: { isPublished } });
    }
    static async deleteJob(companyId, jobId) {
        return prisma_1.prisma.job.delete({ where: { id: jobId } });
    }
    static async listJobs(params) {
        const { companyId, title, category, sortBy = "createdAt", sortOrder = "desc", limit = 10, offset = 0 } = params;
        const where = {
            companyId,
            ...(title ? { title: { contains: title, mode: "insensitive" } } : {}),
            ...(category ? { category: { equals: category } } : {}),
        };
        const [items, total] = await Promise.all([
            prisma_1.prisma.job.findMany({
                where,
                orderBy: sortBy === "deadline" ? { deadline: sortOrder } : { createdAt: sortOrder },
                skip: offset,
                take: limit,
                include: {
                    _count: { select: { applications: true } },
                },
            }),
            prisma_1.prisma.job.count({ where }),
        ]);
        return { items, total, limit, offset };
    }
}
exports.JobRepository = JobRepository;
//# sourceMappingURL=job.repository.js.map