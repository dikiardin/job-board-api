import { UserRole } from "../../generated/prisma";
import { JobRepository } from "../../repositories/job/job.repository";
import { createJobCore, updateJobCore, togglePublishCore, deleteJobCore } from "./job.command.service";
import { listJobsCore, listPublishedJobsCore, jobDetailCore } from "./job.query.service";

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

    return createJobCore({ companyId, body });
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
    
    return updateJobCore({ companyId, jobId, body });
  }

  static async togglePublish(params: { companyId: string; jobId: string; requesterId: number; requesterRole: UserRole; isPublished?: boolean }) {
    const { companyId, jobId, requesterId, requesterRole, isPublished } = params;
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only company admin can publish/unpublish jobs" };
    await this.assertCompanyOwnership(companyId, requesterId);
    const coreParams: { companyId: string; jobId: string; isPublished?: boolean } = { companyId, jobId };
    if (typeof isPublished === "boolean") coreParams.isPublished = isPublished;
    return togglePublishCore(coreParams);
  }

  static async deleteJob(params: { companyId: string; jobId: string; requesterId: number; requesterRole: UserRole }) {
    const { companyId, jobId, requesterId, requesterRole } = params;
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only company admin can delete jobs" };
    await this.assertCompanyOwnership(companyId, requesterId);
    return deleteJobCore({ companyId, jobId });
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
    
    return listJobsCore({ companyId, query });
  }

  private static validateAdminAccess(requesterRole: UserRole): void {
    if (requesterRole !== UserRole.ADMIN) {
      throw { status: 401, message: "Only company admin can list their jobs" };
    }
  }

  private static buildQueryParams(companyId: string, query: any) { return {}; }
  private static formatJobListResponse(result: any) { return result; }

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

    return listPublishedJobsCore({ query: repoQuery });
  }

  static async jobDetail(params: { companyId: string; jobId: string; requesterId: number; requesterRole: UserRole }) {
    const { companyId, jobId, requesterId, requesterRole } = params;
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only company admin can view job detail" };
    await this.assertCompanyOwnership(companyId, requesterId);
    return jobDetailCore({ companyId, jobId });
  }
}
