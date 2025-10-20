import { prisma } from "../../config/prisma";

export async function createJob(
  companyId: string | number,
  data: {
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
  }
) {
  const cid = typeof companyId === "string" ? Number(companyId) : companyId;
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

export async function updateJob(
  companyId: string | number,
  jobId: string | number,
  data: Partial<{
    title: string;
    description: string;
    banner?: string | null;
    category: string;
    city: string;
    employmentType?: string | null;
    experienceLevel?: string | null;
    salaryMin?: number | null;
    salaryMax?: number | null;
    tags: string[];
    deadline?: Date | null;
    isPublished?: boolean;
  }>
) {
  const jid = typeof jobId === "string" ? Number(jobId) : jobId;
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.city !== undefined) updateData.city = data.city;
  if (data.employmentType !== undefined) updateData.employmentType = data.employmentType;
  if (data.experienceLevel !== undefined) updateData.experienceLevel = data.experienceLevel;
  if (data.salaryMin !== undefined) updateData.salaryMin = data.salaryMin;
  if (data.salaryMax !== undefined) updateData.salaryMax = data.salaryMax;
  if (data.tags !== undefined) updateData.tags = data.tags;
  if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
  if (data.banner !== undefined) updateData.bannerUrl = data.banner;
  if (data.deadline !== undefined) updateData.applyDeadline = data.deadline;

  return prisma.job.update({ where: { id: jid }, data: updateData });
}

export async function togglePublish(jobId: string | number, isPublished: boolean) {
  const jid = typeof jobId === "string" ? Number(jobId) : jobId;
  return prisma.job.update({ where: { id: jid }, data: { isPublished } });
}

export async function deleteJob(companyId: string | number, jobId: string | number) {
  const jid = typeof jobId === "string" ? Number(jobId) : jobId;
  return prisma.job.delete({ where: { id: jid } });
}


