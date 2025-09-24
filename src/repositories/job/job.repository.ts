import { prisma } from "../../config/prisma";
import { Prisma } from "../../generated/prisma";

export class JobRepository {
  static async getCompany(companyId: number) {
    return prisma.company.findUnique({ where: { id: companyId } });
  }

  static async createJob(companyId: number, data: {
    title: string;
    description: string;
    banner?: string | null;
    category: string;
    city: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    tags: string[];
    deadline?: Date | null;
    isPublished?: boolean;
  }) {
    return prisma.job.create({
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

  static async updateJob(companyId: number, jobId: number, data: Partial<{
    title: string;
    description: string;
    banner?: string | null;
    category: string;
    city: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    tags: string[];
    deadline?: Date | null;
    isPublished?: boolean;
  }>) {
    return prisma.job.update({
      where: { id: jobId },
      data: {
        ...data,
      },
    });
  }

  static async getJobById(companyId: number, jobId: number) {
    return prisma.job.findFirst({
      where: { id: jobId, companyId },
      include: {
        _count: { select: { applications: true } },
        applications: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "asc" },
        },
        preselectionTests: {
          include: {
            results: true,
          },
        },
      },
    });
  }

  static async togglePublish(jobId: number, isPublished: boolean) {
    return prisma.job.update({ where: { id: jobId }, data: { isPublished } });
  }

  static async deleteJob(companyId: number, jobId: number) {
    return prisma.job.delete({ where: { id: jobId } });
  }

  static async listJobs(params: {
    companyId: number;
    title?: string;
    category?: string;
    sortBy?: "createdAt" | "deadline";
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }) {
    const { companyId, title, category, sortBy = "createdAt", sortOrder = "desc", limit = 10, offset = 0 } = params;

    const where: Prisma.JobWhereInput = {
      companyId,
      ...(title ? { title: { contains: title, mode: "insensitive" } } : {}),
      ...(category ? { category: { equals: category } } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: sortBy === "deadline" ? { deadline: sortOrder } : { createdAt: sortOrder },
        skip: offset,
        take: limit,
        include: {
          _count: { select: { applications: true } },
        },
      }),
      prisma.job.count({ where }),
    ]);

    return { items, total, limit, offset };
  }

  static async listApplicantsForJob(params: {
    companyId: number;
    jobId: number;
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

    // Build user where for name/education/age
    const userWhere: any = {};
    if (typeof name === "string" && name.trim() !== "") userWhere.name = { contains: name, mode: "insensitive" };
    if (typeof education === "string" && education.trim() !== "") userWhere.education = { contains: education, mode: "insensitive" };

    // Age filter using dob between date ranges
    if (typeof ageMin === "number" || typeof ageMax === "number") {
      const now = new Date();
      let dobGte: Date | undefined; // older than ageMax => dob earlier than now - ageMax years
      let dobLte: Date | undefined; // younger than ageMin => dob later than now - ageMin years
      if (typeof ageMax === "number") {
        dobLte = new Date(now);
        dobLte.setFullYear(now.getFullYear() - ageMin!); // placeholder, adjust below
      }
      if (typeof ageMin === "number") {
        dobGte = new Date(now);
        dobGte.setFullYear(now.getFullYear() - ageMax!); // placeholder, adjust below
      }
      // Correct calculation
      const calcDobFromAge = (age: number) => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - age);
        return d;
      };
      const whereDob: any = {};
      if (typeof ageMax === "number") whereDob.gte = calcDobFromAge(ageMax + 1); // >= dob of (ageMax+1) to be age <= ageMax
      if (typeof ageMin === "number") whereDob.lte = calcDobFromAge(ageMin); // <= dob of ageMin to be age >= ageMin
      userWhere.dob = whereDob;
    }

    // Salary filter on application
    const appWhere: any = {
      jobId,
      job: { companyId },
      ...(expectedSalaryMin != null ? { expectedSalary: { gte: expectedSalaryMin } } : {}),
      ...(expectedSalaryMax != null ? { expectedSalary: { lte: expectedSalaryMax, ...(expectedSalaryMin != null ? { gte: expectedSalaryMin } : {}) } } : {}),
    };

    const orderBy: any =
      sortBy === "expectedSalary"
        ? { expectedSalary: sortOrder }
        : sortBy === "age"
        ? { user: { dob: sortOrder === "asc" ? "desc" : "asc" } } // age asc => dob desc (younger later dob)
        : { createdAt: sortOrder }; // appliedAt

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
