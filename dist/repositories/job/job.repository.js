"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRepository = void 0;
const prisma_1 = require("../../config/prisma");
class JobRepository {
    static async getCompany(companyId) {
        const id = typeof companyId === "string" ? Number(companyId) : companyId;
        return prisma_1.prisma.company.findUnique({ where: { id } });
    }
    static async createJob(companyId, data) {
        const cid = typeof companyId === "string" ? Number(companyId) : companyId;
        return prisma_1.prisma.job.create({
            data: {
                companyId: cid,
                title: data.title,
                description: data.description,
                bannerUrl: data.banner ?? null,
                category: data.category,
                city: data.city,
                salaryMin: data.salaryMin ?? null,
                salaryMax: data.salaryMax ?? null,
                tags: data.tags,
                applyDeadline: data.deadline ?? null,
                isPublished: data.isPublished ?? false,
            },
        });
    }
    static async updateJob(companyId, jobId, data) {
        const jid = typeof jobId === "string" ? Number(jobId) : jobId;
        // Build update data with whitelisted fields only
        const updateData = {};
        if (data.title !== undefined)
            updateData.title = data.title;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.category !== undefined)
            updateData.category = data.category;
        if (data.city !== undefined)
            updateData.city = data.city;
        if (data.employmentType !== undefined)
            updateData.employmentType = data.employmentType;
        if (data.experienceLevel !== undefined)
            updateData.experienceLevel = data.experienceLevel;
        if (data.salaryMin !== undefined)
            updateData.salaryMin = data.salaryMin;
        if (data.salaryMax !== undefined)
            updateData.salaryMax = data.salaryMax;
        if (data.tags !== undefined)
            updateData.tags = data.tags;
        if (data.isPublished !== undefined)
            updateData.isPublished = data.isPublished;
        if (data.banner !== undefined)
            updateData.bannerUrl = data.banner;
        if (data.deadline !== undefined)
            updateData.applyDeadline = data.deadline;
        return prisma_1.prisma.job.update({
            where: { id: jid },
            data: updateData,
        });
    }
    static async getJobById(companyId, jobId) {
        const cid = typeof companyId === "string" ? Number(companyId) : companyId;
        const jid = typeof jobId === "string" ? Number(jobId) : jobId;
        return prisma_1.prisma.job.findFirst({
            where: { id: jid, companyId: cid },
            include: {
                _count: { select: { applications: true } },
                applications: {
                    include: {
                        user: true,
                    },
                    orderBy: { createdAt: "asc" },
                },
                preselectionTest: {
                    include: {
                        results: true,
                    },
                },
            },
        });
    }
    static async getJobBySlug(jobSlug) {
        const now = new Date();
        return prisma_1.prisma.job.findFirst({
            where: {
                slug: jobSlug,
                isPublished: true,
                OR: [{ applyDeadline: null }, { applyDeadline: { gte: now } }],
            },
            select: {
                id: true,
                title: true,
                companyId: true,
                applyDeadline: true,
                isPublished: true,
            },
        });
    }
    static async togglePublish(jobId, isPublished) {
        const jid = typeof jobId === "string" ? Number(jobId) : jobId;
        return prisma_1.prisma.job.update({ where: { id: jid }, data: { isPublished } });
    }
    static async deleteJob(companyId, jobId) {
        const jid = typeof jobId === "string" ? Number(jobId) : jobId;
        return prisma_1.prisma.job.delete({ where: { id: jid } });
    }
    static async listJobs(params) {
        const { companyId, title, category, sortBy = "createdAt", sortOrder = "desc", limit = 10, offset = 0, } = params;
        const cid = typeof companyId === "string" ? Number(companyId) : companyId;
        const where = {
            companyId: cid,
            ...(title ? { title: { contains: title, mode: "insensitive" } } : {}),
            ...(category ? { category: { equals: category } } : {}),
        };
        const [items, total] = await Promise.all([
            prisma_1.prisma.job.findMany({
                where,
                orderBy: sortBy === "deadline"
                    ? { applyDeadline: sortOrder }
                    : { createdAt: sortOrder },
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
    static async listPublishedJobs(params) {
        const { title, category, city, sortBy = "createdAt", sortOrder = "desc", limit = 10, offset = 0, } = params;
        const now = new Date();
        const where = {
            isPublished: true,
            ...(title ? { title: { contains: title, mode: "insensitive" } } : {}),
            ...(category ? { category: { equals: category } } : {}),
            ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
            // Optional: exclude expired by deadline if provided
            OR: [{ applyDeadline: null }, { applyDeadline: { gte: now } }],
        };
        const [items, total] = await Promise.all([
            prisma_1.prisma.job.findMany({
                where,
                orderBy: sortBy === "deadline"
                    ? { applyDeadline: sortOrder }
                    : { createdAt: sortOrder },
                skip: offset,
                take: limit,
            }),
            prisma_1.prisma.job.count({ where }),
        ]);
        return { items, total, limit, offset };
    }
    static async getJobPublic(jobId) {
        const now = new Date();
        const jid = typeof jobId === "string" ? Number(jobId) : jobId;
        return prisma_1.prisma.job.findFirst({
            where: {
                id: jid,
                isPublished: true,
                OR: [{ applyDeadline: null }, { applyDeadline: { gte: now } }],
            },
            select: {
                id: true,
                title: true,
                companyId: true,
                applyDeadline: true,
                isPublished: true,
            },
        });
    }
    static async listApplicantsForJob(params) {
        const { companyId, jobId, name, education, ageMin, ageMax, expectedSalaryMin, expectedSalaryMax, sortBy = "appliedAt", sortOrder = "asc", limit = 10, offset = 0, } = params;
        const cid = typeof companyId === "string" ? Number(companyId) : companyId;
        const jid = typeof jobId === "string" ? Number(jobId) : jobId;
        // Build user where for name/education/age with input sanitization
        const userWhere = {};
        if (typeof name === "string" && name.trim() !== "") {
            const sanitizedName = name.trim().substring(0, 100); // Limit length
            userWhere.name = { contains: sanitizedName, mode: "insensitive" };
        }
        if (typeof education === "string" && education.trim() !== "") {
            const sanitizedEducation = education.trim().substring(0, 100); // Limit length
            userWhere.education = {
                contains: sanitizedEducation,
                mode: "insensitive",
            };
        }
        // Age filter using dob between date ranges
        if (typeof ageMin === "number" || typeof ageMax === "number") {
            const now = new Date();
            let dobGte; // older than ageMax => dob earlier than now - ageMax years
            let dobLte; // younger than ageMin => dob later than now - ageMin years
            if (typeof ageMax === "number") {
                dobLte = new Date(now);
                dobLte.setFullYear(now.getFullYear() - ageMin); // placeholder, adjust below
            }
            if (typeof ageMin === "number") {
                dobGte = new Date(now);
                dobGte.setFullYear(now.getFullYear() - ageMax); // placeholder, adjust below
            }
            // Correct calculation
            const calcDobFromAge = (age) => {
                const d = new Date();
                d.setFullYear(d.getFullYear() - age);
                return d;
            };
            const whereDob = {};
            if (typeof ageMax === "number")
                whereDob.gte = calcDobFromAge(ageMax + 1); // >= dob of (ageMax+1) to be age <= ageMax
            if (typeof ageMin === "number")
                whereDob.lte = calcDobFromAge(ageMin); // <= dob of ageMin to be age >= ageMin
            userWhere.dob = whereDob;
        }
        // Salary filter on application
        const appWhere = {
            jobId: jid,
            job: { companyId: cid },
            ...(expectedSalaryMin != null
                ? { expectedSalary: { gte: expectedSalaryMin } }
                : {}),
            ...(expectedSalaryMax != null
                ? {
                    expectedSalary: {
                        lte: expectedSalaryMax,
                        ...(expectedSalaryMin != null ? { gte: expectedSalaryMin } : {}),
                    },
                }
                : {}),
        };
        const orderBy = sortBy === "expectedSalary"
            ? { expectedSalary: sortOrder }
            : sortBy === "age"
                ? { user: { dob: sortOrder === "asc" ? "desc" : "asc" } } // age asc => dob desc (younger later dob)
                : { createdAt: sortOrder }; // appliedAt
        const [items, total] = await Promise.all([
            prisma_1.prisma.application.findMany({
                where: {
                    ...appWhere,
                    ...(Object.keys(userWhere).length ? { user: { is: userWhere } } : {}),
                },
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
                            education: true,
                            dob: true,
                        },
                    },
                },
                orderBy: [
                    { isPriority: "desc" }, // ← IMPORTANT: Priority sorting first
                    orderBy, // Then original sorting
                ],
                skip: offset,
                take: limit,
            }),
            prisma_1.prisma.application.count({
                where: {
                    ...appWhere,
                    ...(Object.keys(userWhere).length ? { user: { is: userWhere } } : {}),
                },
            }),
        ]);
        return { items, total, limit, offset };
    }
}
exports.JobRepository = JobRepository;
//# sourceMappingURL=job.repository.js.map