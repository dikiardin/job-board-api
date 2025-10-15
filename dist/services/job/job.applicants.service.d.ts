import { UserRole, ApplicationStatus } from "../../generated/prisma";
export declare class JobApplicantsService {
    static updateApplicantStatus(params: {
        companyId: string | number;
        jobId: string | number;
        applicationId: number;
        requesterId: number;
        requesterRole: UserRole;
        body: {
            status: ApplicationStatus;
            reviewNote?: string;
        };
    }): Promise<{
        id: number;
        status: import("../../generated/prisma").$Enums.ApplicationStatus;
        reviewNote: string | null;
        updatedAt: Date;
    }>;
    static listApplicants(params: {
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
    }): Promise<{
        total: number;
        limit: number;
        offset: number;
        items: {
            applicationId: any;
            userId: any;
            userName: any;
            userEmail: any;
            profilePicture: any;
            appliedAt: any;
            expectedSalary: any;
            status: any;
            cvFile: any;
            testScore: number | null;
            preselectionPassed: boolean | null;
            isPriority: any;
            education: any;
            age: number | null;
        }[];
    }>;
}
//# sourceMappingURL=job.applicants.service.d.ts.map