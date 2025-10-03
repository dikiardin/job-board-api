import { prisma } from "../../config/prisma";
import { Prisma } from "../../generated/prisma";

export class JobRepository {
  static async getCompany(companyId: string | number) {
    const id = typeof companyId === 'string' ? Number(companyId) : companyId;
    return prisma.company.findUnique({ where: { id } });
  }

  static async createJob(companyId: string | number, data: {
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
    const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
    return prisma.job.create({
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

  static async updateJob(companyId: string | number, jobId: string | number, data: Partial<{
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
    const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
    return prisma.job.update({
      where: { id: jid },
      data: {
        ...data,
        ...(data.banner !== undefined ? { bannerUrl: data.banner } : {}),
        ...(data.deadline !== undefined ? { applyDeadline: data.deadline } : {}),
      },
    });
  }

  static async getJobById(companyId: string | number, jobId: string | number) {
    const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
    const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
    return prisma.job.findFirst({
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

  static async togglePublish(jobId: string | number, isPublished: boolean) {
    const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
    return prisma.job.update({ where: { id: jid }, data: { isPublished } });
  }

  static async deleteJob(companyId: string | number, jobId: string | number) {
    const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
    return prisma.job.delete({ where: { id: jid } });
  }

  static async listJobs(params: {
    companyId: string | number;
    title?: string;
    category?: string;
    sortBy?: "createdAt" | "deadline";
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }) {
    const { companyId, title, category, sortBy = "createdAt", sortOrder = "desc", limit = 10, offset = 0 } = params;
    const cid = typeof companyId === 'string' ? Number(companyId) : companyId;

    const where: Prisma.JobWhereInput = {
      companyId: cid,
      ...(title ? { title: { contains: title, mode: "insensitive" } } : {}),
      ...(category ? { category: { equals: category } } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: sortBy === "deadline" ? { applyDeadline: sortOrder } : { createdAt: sortOrder },
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

  static async listPublishedJobs(params: {
    title?: string;
    category?: string;
    city?: string;
    sortBy?: "createdAt" | "deadline";
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }) {
    const { title, category, city, sortBy = "createdAt", sortOrder = "desc", limit = 10, offset = 0 } = params;

    const now = new Date();
    const where: Prisma.JobWhereInput = {
      isPublished: true,
      ...(title ? { title: { contains: title, mode: "insensitive" } } : {}),
      ...(category ? { category: { equals: category } } : {}),
      ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
      // Optional: exclude expired by deadline if provided
      OR: [
        { deadline: null },
        { deadline: { gte: now } },
      ],
    };

    const [items, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: sortBy === "deadline" ? { applyDeadline: sortOrder } : { createdAt: sortOrder },
        skip: offset,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    return { items, total, limit, offset };
  }

  static async getJobPublic(jobId: string | number) {
    const now = new Date();
    const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
    return prisma.job.findFirst({
      where: {
        id: jid,
        isPublished: true,
        OR: [{ applyDeadline: null }, { applyDeadline: { gte: now } }],
      },
      select: { id: true, title: true, companyId: true, applyDeadline: true, isPublished: true },
    });
  }
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

    // Build user where for name/education/age with input sanitization
    const userWhere: any = {};
    if (typeof name === "string" && name.trim() !== "") {
      const sanitizedName = name.trim().substring(0, 100); // Limit length
      userWhere.name = { contains: sanitizedName, mode: "insensitive" };
    }
    if (typeof education === "string" && education.trim() !== "") {
      const sanitizedEducation = education.trim().substring(0, 100); // Limit length
      userWhere.education = { contains: sanitizedEducation, mode: "insensitive" };
    }

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
      jobId: jid,
      job: { companyId: cid },
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
