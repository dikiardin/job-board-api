import { prisma } from "../../config/prisma";

export class JobApplicantsRepository {
  static async listApplicantsForJob(params: {
    companyId: string | number;
    jobId: string | number;
    name?: string;
    education?: string;
    ageMin?: number;
    ageMax?: number;
    expectedSalaryMin?: number;
    expectedSalaryMax?: number;
    sortBy?: "appliedAt" | "expectedSalary" | "age";
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }) {
    const { companyId, jobId, name, education, ageMin, ageMax, expectedSalaryMin, expectedSalaryMax, sortBy = "appliedAt", sortOrder = "asc", limit = 10, offset = 0 } = params;
    const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
    const jid = typeof jobId === 'string' ? Number(jobId) : jobId;

    // Build user where for name/education/age
    const userWhere: any = {};
    if (typeof name === "string" && name.trim() !== "") userWhere.name = { contains: name, mode: "insensitive" };
    if (typeof education === "string" && education.trim() !== "") userWhere.education = { contains: education, mode: "insensitive" };

    if (typeof ageMin === "number" || typeof ageMax === "number") {
      const calcDobFromAge = (age: number) => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - age);
        return d;
      };
      const whereDob: any = {};
      if (typeof ageMax === "number") whereDob.gte = calcDobFromAge(ageMax + 1);
      if (typeof ageMin === "number") whereDob.lte = calcDobFromAge(ageMin);
      userWhere.dob = whereDob;
    }

    // Salary filter on application
    const appWhere: any = {
      jobId: jid,
      job: { companyId: cid },
      ...(expectedSalaryMin != null ? { expectedSalary: { gte: expectedSalaryMin } } : {}),
      ...(expectedSalaryMax != null ? { expectedSalary: { lte: expectedSalaryMax, ...(expectedSalaryMin != null ? { gte: expectedSalaryMin } : {}) } } : {}),
    };

    const orderBy: any =
      sortBy === "expectedSalary"
        ? { expectedSalary: sortOrder }
        : sortBy === "age"
        ? { user: { dob: sortOrder === "asc" ? "desc" : "asc" } }
        : { createdAt: sortOrder };

    const [items, total] = await Promise.all([
      prisma.application.findMany({
        where: {
          ...appWhere,
          ...(Object.keys(userWhere).length ? { user: { is: userWhere } } : {}),
        },
        include: { user: true },
        orderBy,
        skip: offset,
        take: limit,
      }),
      prisma.application.count({
        where: {
          ...appWhere,
          ...(Object.keys(userWhere).length ? { user: { is: userWhere } } : {}),
        },
      }),
    ]);

    return { items, total, limit, offset };
  }
}
