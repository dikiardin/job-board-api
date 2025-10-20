import { JobRepository } from "../../repositories/job/job.repository";

export async function createJobCore(params: {
  companyId: string;
  body: {
    title: string;
    description: string;
    banner?: string | null;
    category: string;
    city: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    tags?: string[];
    deadline?: string | Date | null;
    isPublished?: boolean;
  };
}) {
  const { companyId, body } = params;
  const job = await JobRepository.createJob(companyId, {
    title: body.title,
    description: body.description,
    banner: body.banner ?? null,
    category: body.category,
    city: body.city,
    salaryMin: body.salaryMin ?? null,
    salaryMax: body.salaryMax ?? null,
    tags: body.tags ?? [],
    deadline: body.deadline ? new Date(body.deadline) : null,
    isPublished: body.isPublished ?? false,
  });
  return job;
}

export async function updateJobCore(params: {
  companyId: string;
  jobId: string;
  body: any;
}) {
  const { companyId, jobId, body } = params;
  const updateData: any = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.category !== undefined) updateData.category = body.category;
  if (body.city !== undefined) updateData.city = body.city;
  if (body.employmentType !== undefined) updateData.employmentType = body.employmentType;
  if (body.experienceLevel !== undefined) updateData.experienceLevel = body.experienceLevel;
  if (body.salaryMin !== undefined) updateData.salaryMin = body.salaryMin;
  if (body.salaryMax !== undefined) updateData.salaryMax = body.salaryMax;
  if (body.tags !== undefined) updateData.tags = body.tags;
  if (body.banner !== undefined) updateData.banner = body.banner;
  if (body.isPublished !== undefined) updateData.isPublished = body.isPublished;
  if (body.deadline !== undefined) updateData.deadline = body.deadline ? new Date(body.deadline) : null;
  const job = await JobRepository.updateJob(companyId, jobId, updateData);
  return job;
}

export async function togglePublishCore(params: {
  companyId: string;
  jobId: string;
  isPublished?: boolean;
}) {
  const { companyId, jobId, isPublished } = params;
  const detail = await JobRepository.getJobById(companyId, jobId);
  if (!detail) throw { status: 404, message: "Job not found" };
  const nextState = typeof isPublished === "boolean" ? isPublished : !detail.isPublished;
  const updated = await JobRepository.togglePublish(jobId, nextState);
  return updated;
}

export async function deleteJobCore(params: { companyId: string; jobId: string }) {
  const { companyId, jobId } = params;
  await JobRepository.deleteJob(companyId, jobId);
  return { success: true };
}


