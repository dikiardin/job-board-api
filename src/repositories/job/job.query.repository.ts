import { prisma } from "../../config/prisma";
import { Prisma } from "../../generated/prisma";

export async function getCompany(companyId: string | number) {
  const id = typeof companyId === "string" ? Number(companyId) : companyId;
  return prisma.company.findUnique({ where: { id } });
}

export async function getJobById(companyId: string | number, jobId: string | number) {
  const cid = typeof companyId === "string" ? Number(companyId) : companyId;
  const jid = typeof jobId === "string" ? Number(jobId) : jobId;
  return prisma.job.findFirst({
    where: { id: jid, companyId: cid },
    include: {
      _count: { select: { applications: true } },
      applications: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
      preselectionTest: { include: { results: true } },
    },
  });
}

export async function getJobBySlug(jobSlug: string) {
  const now = new Date();
  return prisma.job.findFirst({
    where: {
      slug: jobSlug,
      isPublished: true,
      OR: [{ applyDeadline: null }, { applyDeadline: { gte: now } }],
    },
    select: { id: true, title: true, companyId: true, applyDeadline: true, isPublished: true },
  });
}

export async function listJobs(params: {
  companyId: string | number;
  title?: string;
  category?: string;
  sortBy?: "createdAt" | "deadline";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}) {
  const { companyId, title, category, sortBy = "createdAt", sortOrder = "desc", limit = 10, offset = 0 } = params;
  const cid = typeof companyId === "string" ? Number(companyId) : companyId;

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
      include: { _count: { select: { applications: true } } },
    }),
    prisma.job.count({ where }),
  ]);

  return { items, total, limit, offset };
}

export async function listPublishedJobs(params: {
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
    OR: [{ applyDeadline: null }, { applyDeadline: { gte: now } }],
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

export async function getJobPublic(jobId: string | number) {
  const now = new Date();
  const jid = typeof jobId === "string" ? Number(jobId) : jobId;
  return prisma.job.findFirst({
    where: { id: jid, isPublished: true, OR: [{ applyDeadline: null }, { applyDeadline: { gte: now } }] },
    select: { id: true, title: true, companyId: true, applyDeadline: true, isPublished: true },
  });
}

export async function listApplicantsForJob(params: {
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
  const cid = typeof companyId === "string" ? Number(companyId) : companyId;
  const jid = typeof jobId === "string" ? Number(jobId) : jobId;

  const userWhere: any = {};
  if (typeof name === "string" && name.trim() !== "") {
    const sanitizedName = name.trim().substring(0, 100);
    userWhere.name = { contains: sanitizedName, mode: "insensitive" };
  }
  if (typeof education === "string" && education.trim() !== "") {
    const sanitizedEducation = education.trim().substring(0, 100);
    userWhere.education = { contains: sanitizedEducation, mode: "insensitive" };
  }

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

  const appWhere: any = {
    jobId: jid,
    job: { companyId: cid },
    ...(expectedSalaryMin != null ? { expectedSalary: { gte: expectedSalaryMin } } : {}),
    ...(expectedSalaryMax != null
      ? { expectedSalary: { lte: expectedSalaryMax, ...(expectedSalaryMin != null ? { gte: expectedSalaryMin } : {}) } }
      : {}),
  };

  const orderBy: any =
    sortBy === "expectedSalary"
      ? { expectedSalary: sortOrder }
      : sortBy === "age"
      ? { user: { dob: sortOrder === "asc" ? "desc" : "asc" } }
      : { createdAt: sortOrder };

  const [items, total] = await Promise.all([
    prisma.application.findMany({
      where: { ...appWhere, ...(Object.keys(userWhere).length ? { user: { is: userWhere } } : {}) },
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
        isPriority: true,
        user: { select: { id: true, name: true, email: true, phone: true, profilePicture: true, education: true, dob: true } },
      },
      orderBy: [{ isPriority: "desc" }, orderBy],
      skip: offset,
      take: limit,
    }),
    prisma.application.count({ where: { ...appWhere, ...(Object.keys(userWhere).length ? { user: { is: userWhere } } : {}) } }),
  ]);

  return { items, total, limit, offset };
}


