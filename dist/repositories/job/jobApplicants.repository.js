"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicantsRepository = void 0;
const prisma_1 = require("../../config/prisma");
class JobApplicantsRepository {
    static async listApplicantsForJob(params) {
        const { companyId, jobId, name, education, ageMin, ageMax, expectedSalaryMin, expectedSalaryMax, sortBy = "appliedAt", sortOrder = "asc", limit = 10, offset = 0 } = params;
        // Build user where for name/education/age
        const userWhere = {};
        if (typeof name === "string" && name.trim() !== "")
            userWhere.name = { contains: name, mode: "insensitive" };
        if (typeof education === "string" && education.trim() !== "")
            userWhere.education = { contains: education, mode: "insensitive" };
        if (typeof ageMin === "number" || typeof ageMax === "number") {
            const calcDobFromAge = (age) => {
                const d = new Date();
                d.setFullYear(d.getFullYear() - age);
                return d;
            };
            const whereDob = {};
            if (typeof ageMax === "number")
                whereDob.gte = calcDobFromAge(ageMax + 1);
            if (typeof ageMin === "number")
                whereDob.lte = calcDobFromAge(ageMin);
            userWhere.dob = whereDob;
        }
        // Salary filter on application
        const appWhere = {
            jobId,
            job: { companyId },
            ...(expectedSalaryMin != null ? { expectedSalary: { gte: expectedSalaryMin } } : {}),
            ...(expectedSalaryMax != null ? { expectedSalary: { lte: expectedSalaryMax, ...(expectedSalaryMin != null ? { gte: expectedSalaryMin } : {}) } } : {}),
        };
        const orderBy = sortBy === "expectedSalary"
            ? { expectedSalary: sortOrder }
            : sortBy === "age"
                ? { user: { dob: sortOrder === "asc" ? "desc" : "asc" } }
                : { createdAt: sortOrder };
        const [items, total] = await Promise.all([
            prisma_1.prisma.application.findMany({
                where: {
                    ...appWhere,
                    ...(Object.keys(userWhere).length ? { user: { is: userWhere } } : {}),
                },
                include: { user: true },
                orderBy,
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
exports.JobApplicantsRepository = JobApplicantsRepository;
//# sourceMappingURL=jobApplicants.repository.js.map