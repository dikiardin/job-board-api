import { UserRole, ApplicationStatus } from "../../generated/prisma";
import { JobRepository } from "../../repositories/job/job.repository";
import { ApplicationRepo } from "../../repositories/application/application.repository";
import { PreselectionRepository } from "../../repositories/preselection/preselection.repository";

async function assertCompanyOwnership(companyId: string | number, requesterId: number) {
  const company = await JobRepository.getCompany(companyId);
  if (!company) throw { status: 404, message: "Company not found" };
  if (company.adminId !== requesterId) throw { status: 403, message: "You don't own this company" };
  return company;
}

export class JobApplicantsService {
  static async updateApplicantStatus(params: {
    companyId: string | number;
    jobId: string | number;
    applicationId: number;
    requesterId: number;
    requesterRole: UserRole;
    body: { status: ApplicationStatus; reviewNote?: string };
  }) {
    const { companyId, jobId, applicationId, requesterId, requesterRole, body } = params;
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only company admin can update applicant status" };
    await assertCompanyOwnership(companyId, requesterId);

    const app = await ApplicationRepo.getApplicationWithOwnership(applicationId);
    const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
    const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
    if (!app || app.jobId !== jid || (app as any).job.companyId !== cid) throw { status: 404, message: "Application not found" };

    const allowed: ApplicationStatus[] = [
      ApplicationStatus.IN_REVIEW,
      ApplicationStatus.INTERVIEW,
      ApplicationStatus.ACCEPTED,
      ApplicationStatus.REJECTED,
    ];
    if (!allowed.includes(body.status)) throw { status: 400, message: "Invalid status transition" };

    const updated = await ApplicationRepo.updateApplicationStatus(applicationId, body.status as any, body.reviewNote ?? null);
    return { id: updated.id, status: updated.status, reviewNote: updated.reviewNote, updatedAt: updated.updatedAt };
  }

  static async listApplicants(params: {
    companyId: string | number;
    jobId: string | number;
    requesterId: number;
    requesterRole: UserRole;
    query: {
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
    };
  }) {
    const { companyId, jobId, requesterId, requesterRole, query } = params;
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only company admin can list applicants" };
    await assertCompanyOwnership(companyId, requesterId);

    const result = await JobRepository.listApplicantsForJob({
      companyId,
      jobId,
      ...(typeof query.name === "string" ? { name: query.name } : {}),
      ...(typeof query.education === "string" ? { education: query.education } : {}),
      ...(typeof query.ageMin === "number" ? { ageMin: query.ageMin } : {}),
      ...(typeof query.ageMax === "number" ? { ageMax: query.ageMax } : {}),
      ...(typeof query.expectedSalaryMin === "number" ? { expectedSalaryMin: query.expectedSalaryMin } : {}),
      ...(typeof query.expectedSalaryMax === "number" ? { expectedSalaryMax: query.expectedSalaryMax } : {}),
      ...(query.sortBy ? { sortBy: query.sortBy } : {}),
      ...(query.sortOrder ? { sortOrder: query.sortOrder } : {}),
      ...(typeof query.limit === "number" ? { limit: query.limit } : {}),
      ...(typeof query.offset === "number" ? { offset: query.offset } : {}),
    });

    // Attach preselection test results if available
    let scoreByUser = new Map<number, number>();
    let passingScore: number | null = null;
    const test = await PreselectionRepository.getTestByJobId(jobId);
    if (test) {
      passingScore = test.passingScore ?? null;
      const userIds = result.items.map((a: any) => a.userId);
      const results = await PreselectionRepository.getResultsByTestAndUsers(test.id, userIds);
      scoreByUser = new Map<number, number>(results.map((r: any) => [r.userId, r.score]));
    }

    return {
      total: result.total,
      limit: result.limit,
      offset: result.offset,
      items: result.items.map((a: any) => {
        const score = scoreByUser.get(a.userId) ?? null;
        const preselectionPassed = score != null ? (passingScore != null ? score >= passingScore : true) : null;
        return {
          applicationId: a.id,
          appliedAt: a.createdAt,
          expectedSalary: a.expectedSalary ?? null,
          status: a.status,
          cvFile: a.cvFile,
          testScore: score,
          preselectionPassed,
          user: {
            id: a.userId,
            name: a.user?.name,
            email: a.user?.email,
            profilePicture: a.user?.profilePicture ?? null,
            education: a.user?.education ?? null,
            dob: a.user?.dob ?? null,
          },
        };
      }),
    };
  }
}
