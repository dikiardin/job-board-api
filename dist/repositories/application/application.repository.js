"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRepo = void 0;
const prisma_1 = require("../../config/prisma");
class ApplicationRepo {
    static async createApplication(data) {
        return prisma_1.prisma.application.create({
            data: {
                userId: data.userId,
                jobId: typeof data.jobId === "string" ? Number(data.jobId) : data.jobId,
                cvUrl: data.cvUrl,
                cvFileName: data.cvFileName ?? null,
                cvFileSize: data.cvFileSize ?? null,
                expectedSalary: typeof data.expectedSalary === "number" ? data.expectedSalary : null,
                isPriority: data.isPriority ?? false,
            },
        });
    }
    static async findExisting(userId, jobId) {
        return prisma_1.prisma.application.findFirst({
            where: {
                userId,
                jobId: typeof jobId === "string" ? Number(jobId) : jobId,
            },
        });
    }
    static async getApplicationWithOwnership(applicationId) {
        return prisma_1.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                job: { include: { company: true } },
                user: true,
            },
        });
    }
    static async updateApplicationStatus(applicationId, status, reviewNote) {
        return prisma_1.prisma.application.update({
            where: { id: applicationId },
            data: {
                status,
                reviewNote: reviewNote ?? null,
                reviewUpdatedAt: new Date(),
            },
        });
    }
    static async getApplicationsByUserId(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [applications, total] = await Promise.all([
            prisma_1.prisma.application.findMany({
                where: { userId },
                select: {
                    id: true,
                    userId: true,
                    jobId: true,
                    cvUrl: true,
                    cvFileName: true,
                    cvFileSize: true,
                    expectedSalary: true,
                    expectedSalaryCurrency: true,
                    status: true,
                    reviewNote: true,
                    reviewUpdatedAt: true,
                    referralSource: true,
                    createdAt: true,
                    updatedAt: true,
                    isPriority: true, // ← Include priority field
                    job: {
                        select: {
                            id: true,
                            slug: true,
                            title: true,
                            city: true,
                            category: true,
                            salaryMin: true,
                            salaryMax: true,
                            company: {
                                select: {
                                    id: true,
                                    slug: true,
                                    name: true,
                                    logoUrl: true,
                                },
                            },
                        },
                    },
                    timeline: { orderBy: { createdAt: "asc" } },
                    interviews: { orderBy: { startsAt: "asc" } },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma_1.prisma.application.count({ where: { userId } }),
        ]);
        return { applications, total };
    }
    static async getApplicationsForEmployer(companyId, page = 1, limit = 10, status) {
        const skip = (page - 1) * limit;
        const whereClause = {
            job: { companyId },
        };
        if (status) {
            whereClause.status = status;
        }
        const [applications, total] = await Promise.all([
            prisma_1.prisma.application.findMany({
                where: whereClause,
                select: {
                    id: true,
                    userId: true,
                    jobId: true,
                    cvUrl: true,
                    cvFileName: true,
                    cvFileSize: true,
                    expectedSalary: true,
                    expectedSalaryCurrency: true,
                    status: true,
                    reviewNote: true,
                    reviewUpdatedAt: true,
                    referralSource: true,
                    createdAt: true,
                    updatedAt: true,
                    isPriority: true, // ← IMPORTANT: Include priority field
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            profilePicture: true,
                        },
                    },
                    job: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        },
                    },
                    timeline: { orderBy: { createdAt: "asc" } },
                },
                orderBy: [
                    { isPriority: "desc" }, // Priority applications first
                    { createdAt: "desc" }, // Then by newest
                ],
                skip,
                take: limit,
            }),
            prisma_1.prisma.application.count({ where: whereClause }),
        ]);
        return { applications, total };
    }
}
exports.ApplicationRepo = ApplicationRepo;
//# sourceMappingURL=application.repository.js.map