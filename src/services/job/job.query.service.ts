import { JobRepository } from "../../repositories/job/job.repository";

export async function listJobsCore(params: {
  companyId: string;
  query: { title?: string; category?: string; sortBy?: "createdAt" | "deadline"; sortOrder?: "asc" | "desc"; limit?: number; offset?: number };
}) {
  const { companyId, query } = params;
  const repoQuery: any = { companyId };
  if (typeof query.title === "string") repoQuery.title = query.title;
  if (typeof query.category === "string") repoQuery.category = query.category;
  if (query.sortBy === "createdAt" || query.sortBy === "deadline") repoQuery.sortBy = query.sortBy;
  if (query.sortOrder === "asc" || query.sortOrder === "desc") repoQuery.sortOrder = query.sortOrder;
  if (typeof query.limit === "number") repoQuery.limit = query.limit;
  if (typeof query.offset === "number") repoQuery.offset = query.offset;
  const result = await JobRepository.listJobs(repoQuery);
  return {
    total: result.total,
    limit: result.limit,
    offset: result.offset,
    items: result.items.map((j: any) => ({
      id: j.id,
      title: j.title,
      category: j.category,
      city: j.city,
      isPublished: j.isPublished,
      deadline: j.deadline,
      createdAt: j.createdAt,
      applicantsCount: j._count?.applications ?? 0,
    })),
  };
}

export async function listPublishedJobsCore(params: {
  query: { title?: string; category?: string; city?: string; sortBy?: "createdAt" | "deadline"; sortOrder?: "asc" | "desc"; limit?: number; offset?: number };
}) {
  const { query } = params;
  const repoQuery: any = {};
  if (typeof query.title === "string") repoQuery.title = query.title;
  if (typeof query.category === "string") repoQuery.category = query.category;
  if (typeof query.city === "string") repoQuery.city = query.city;
  if (query.sortBy === "createdAt" || query.sortBy === "deadline") repoQuery.sortBy = query.sortBy;
  if (query.sortOrder === "asc" || query.sortOrder === "desc") repoQuery.sortOrder = query.sortOrder;
  if (typeof query.limit === "number") repoQuery.limit = query.limit;
  if (typeof query.offset === "number") repoQuery.offset = query.offset;
  const result = await JobRepository.listPublishedJobs(repoQuery);
  return {
    total: result.total,
    limit: result.limit,
    offset: result.offset,
    items: result.items.map((j: any) => ({
      id: j.id,
      title: j.title,
      category: j.category,
      city: j.city,
      deadline: j.deadline,
      createdAt: j.createdAt,
      companyId: j.companyId,
      companyName: j.company?.name,
    })),
  };
}

export async function jobDetailCore(params: { companyId: string; jobId: string }) {
  const { companyId, jobId } = params;
  const job = await JobRepository.getJobById(companyId, jobId);
  if (!job) throw { status: 404, message: "Job not found" };
  const test = (job as any).preselectionTest || null;
  const passingScore = test?.passingScore ?? null;
  const applicants = ((job as any).applications ?? []).map((a: any) => {
    let preselectionPassed: boolean | undefined = undefined;
    if (test) {
      const result = test.results.find((r: any) => r.userId === a.userId);
      if (result) {
        preselectionPassed = passingScore != null ? result.score >= passingScore : true;
      } else {
        preselectionPassed = false;
      }
    }
    return {
      applicationId: a.id,
      userId: a.userId,
      userName: a.user?.name,
      userEmail: a.user?.email,
      profilePicture: a.user?.profilePicture ?? null,
      expectedSalary: a.expectedSalary ?? null,
      cvFile: a.cvUrl ?? null,
      score: test ? test.results.find((r: any) => r.userId === a.userId)?.score ?? null : null,
      preselectionPassed,
      status: a.status,
      appliedAt: a.createdAt,
    };
  });

  return {
    id: job.id,
    title: job.title,
    description: job.description,
    banner: (job as any).bannerUrl ?? null,
    category: job.category,
    city: job.city,
    employmentType: job.employmentType ?? null,
    experienceLevel: job.experienceLevel ?? null,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    tags: job.tags,
    deadline: (job as any).applyDeadline ?? null,
    isPublished: job.isPublished,
    createdAt: job.createdAt,
    applicantsCount: (job as any)._count?.applications ?? ((job as any).applications?.length ?? 0),
    applicants,
  };
}


