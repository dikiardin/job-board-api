import { Prisma } from "../../generated/prisma";
import * as Q from "./job.query.repository";
import * as M from "./job.mutation.repository";

export class JobRepository {
  static async getCompany(companyId: string | number) {
    return Q.getCompany(companyId);
  }

  static async createJob(
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
    return M.createJob(companyId, data);
  }

  static async updateJob(
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
    return M.updateJob(companyId, jobId, data);
  }

  static async getJobById(companyId: string | number, jobId: string | number) {
    return Q.getJobById(companyId, jobId);
  }

  static async getJobBySlug(jobSlug: string) {
    return Q.getJobBySlug(jobSlug);
  }

  static async togglePublish(jobId: string | number, isPublished: boolean) {
    return M.togglePublish(jobId, isPublished);
  }

  static async deleteJob(companyId: string | number, jobId: string | number) {
    return M.deleteJob(companyId, jobId);
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
    return Q.listJobs(params);
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
    return Q.listPublishedJobs(params);
  }

  static async getJobPublic(jobId: string | number) {
    return Q.getJobPublic(jobId);
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
    return Q.listApplicantsForJob(params);
  }
}
