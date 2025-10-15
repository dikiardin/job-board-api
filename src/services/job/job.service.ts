import { UserRole } from "../../generated/prisma";
import { JobRepository } from "../../repositories/job/job.repository";

export class JobService {
  static async assertCompanyOwnership(companyId: string, requesterId: number) {
    const company = await JobRepository.getCompany(companyId);
    if (!company) throw { status: 404, message: "Company not found" };
    const ownerId = (company as any).ownerAdminId ?? (company as any).adminId;
    if (ownerId !== requesterId) throw { status: 403, message: "You don't own this company" };
    return company;
  }

  static validateJobPayload(payload: any, isUpdate = false) {
    const errors: string[] = [];
    if (!isUpdate) {
      if (!payload?.title || typeof payload.title !== "string") errors.push("title is required");
      if (!payload?.description || typeof payload.description !== "string") errors.push("description is required");
      if (!payload?.category || typeof payload.category !== "string") errors.push("category is required");
      if (!payload?.city || typeof payload.city !== "string") errors.push("city is required");
    }
    if (payload?.deadline) {
      const d = new Date(payload.deadline);
      if (isNaN(d.getTime())) errors.push("deadline must be a valid date");
      // Only check past date for CREATE, not UPDATE
      else if (!isUpdate && d.getTime() < Date.now()) {
        errors.push("deadline cannot be in the past");
      }
    }
    if (payload?.tags && !Array.isArray(payload.tags)) errors.push("tags must be an array of strings");
    if (errors.length) throw { status: 400, message: errors.join(", ") };
  }

  static async createJob(params: {
    companyId: string;
    requesterId: number;
    requesterRole: UserRole;
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
    const { companyId, requesterId, requesterRole, body } = params;
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only company admin can create jobs" };
    await this.assertCompanyOwnership(companyId, requesterId);
    this.validateJobPayload(body);

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

  static async updateJob(params: {
    companyId: string;
    jobId: string;
    requesterId: number;
    requesterRole: UserRole;
    body: any;
  }) {
    const { companyId, jobId, requesterId, requesterRole, body } = params;
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only company admin can update jobs" };
    await this.assertCompanyOwnership(companyId, requesterId);
    this.validateJobPayload(body, true);
    
    // Build update data with only valid fields
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

  static async togglePublish(params: { companyId: string; jobId: string; requesterId: number; requesterRole: UserRole; isPublished?: boolean }) {
    const { companyId, jobId, requesterId, requesterRole, isPublished } = params;
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only company admin can publish/unpublish jobs" };
    await this.assertCompanyOwnership(companyId, requesterId);
    const detail = await JobRepository.getJobById(companyId, jobId);
    if (!detail) throw { status: 404, message: "Job not found" };
    const nextState = typeof isPublished === "boolean" ? isPublished : !detail.isPublished;
    const updated = await JobRepository.togglePublish(jobId, nextState);
    return updated;
  }

  static async deleteJob(params: { companyId: string; jobId: string; requesterId: number; requesterRole: UserRole }) {
    const { companyId, jobId, requesterId, requesterRole } = params;
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only company admin can delete jobs" };
    await this.assertCompanyOwnership(companyId, requesterId);
    await JobRepository.deleteJob(companyId, jobId);
    return { success: true };
  }

  static async listJobs(params: {
    companyId: string;
    requesterId: number;
    requesterRole: UserRole;
    query: { title?: string; category?: string; sortBy?: "createdAt" | "deadline"; sortOrder?: "asc" | "desc"; limit?: number; offset?: number };
  }) {
    const { companyId, requesterId, requesterRole, query } = params;
    
    this.validateAdminAccess(requesterRole);
    await this.assertCompanyOwnership(companyId, requesterId);
    
    const repoQuery = this.buildQueryParams(companyId, query);
    const result = await JobRepository.listJobs(repoQuery);
    
    return this.formatJobListResponse(result);
  }

  private static validateAdminAccess(requesterRole: UserRole): void {
    if (requesterRole !== UserRole.ADMIN) {
      throw { status: 401, message: "Only company admin can list their jobs" };
    }
  }

  private static buildQueryParams(companyId: string, query: any) {
    const repoQuery: any = { companyId };
    
    if (typeof query.title === "string") repoQuery.title = query.title;
    if (typeof query.category === "string") repoQuery.category = query.category;
    if (query.sortBy === "createdAt" || query.sortBy === "deadline") repoQuery.sortBy = query.sortBy;
    if (query.sortOrder === "asc" || query.sortOrder === "desc") repoQuery.sortOrder = query.sortOrder;
    if (typeof query.limit === "number") repoQuery.limit = query.limit;
    if (typeof query.offset === "number") repoQuery.offset = query.offset;
    
    return repoQuery;
  }

  private static formatJobListResponse(result: any) {
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

  static async listPublishedJobs(params: {
    query: { title?: string; category?: string; city?: string; sortBy?: "createdAt" | "deadline"; sortOrder?: "asc" | "desc"; limit?: number; offset?: number };
  }) {
    const { query } = params;
    const repoQuery: {
      title?: string;
      category?: string;
      city?: string;
      sortBy?: "createdAt" | "deadline";
      sortOrder?: "asc" | "desc";
      limit?: number;
      offset?: number;
    } = {};

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

  static async jobDetail(params: { companyId: string; jobId: string; requesterId: number; requesterRole: UserRole }) {
    const { companyId, jobId, requesterId, requesterRole } = params;
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only company admin can view job detail" };
    await this.assertCompanyOwnership(companyId, requesterId);
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
}
