import { UserRole } from "../../generated/prisma";
export declare class JobService {
    static assertCompanyOwnership(companyId: number, requesterId: number): Promise<{
        name: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        location: string | null;
        description: string | null;
        website: string | null;
        logo: string | null;
        adminId: number | null;
    }>;
    static validateJobPayload(payload: any, isUpdate?: boolean): void;
    static createJob(params: {
        companyId: number;
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
    }): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        companyId: number;
        description: string;
        title: string;
        category: string;
        city: string;
        salaryMin: number | null;
        salaryMax: number | null;
        tags: string[];
        banner: string | null;
        deadline: Date | null;
        isPublished: boolean;
    }>;
    static updateJob(params: {
        companyId: number;
        jobId: number;
        requesterId: number;
        requesterRole: UserRole;
        body: any;
    }): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        companyId: number;
        description: string;
        title: string;
        category: string;
        city: string;
        salaryMin: number | null;
        salaryMax: number | null;
        tags: string[];
        banner: string | null;
        deadline: Date | null;
        isPublished: boolean;
    }>;
    static togglePublish(params: {
        companyId: number;
        jobId: number;
        requesterId: number;
        requesterRole: UserRole;
    }): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        companyId: number;
        description: string;
        title: string;
        category: string;
        city: string;
        salaryMin: number | null;
        salaryMax: number | null;
        tags: string[];
        banner: string | null;
        deadline: Date | null;
        isPublished: boolean;
    }>;
    static deleteJob(params: {
        companyId: number;
        jobId: number;
        requesterId: number;
        requesterRole: UserRole;
    }): Promise<{
        success: boolean;
    }>;
    static listJobs(params: {
        companyId: number;
        requesterId: number;
        requesterRole: UserRole;
        query: {
            title?: string;
            category?: string;
            sortBy?: "createdAt" | "deadline";
            sortOrder?: "asc" | "desc";
            limit?: number;
            offset?: number;
        };
    }): Promise<{
        total: number;
        limit: number;
        offset: number;
        items: {
            id: number;
            title: string;
            category: string;
            city: string;
            isPublished: boolean;
            deadline: Date | null;
            createdAt: Date;
            applicantsCount: any;
        }[];
    }>;
    static listPublishedJobs(params: {
        query: {
            title?: string;
            category?: string;
            city?: string;
            sortBy?: "createdAt" | "deadline";
            sortOrder?: "asc" | "desc";
            limit?: number;
            offset?: number;
        };
    }): Promise<{
        total: number;
        limit: number;
        offset: number;
        items: {
            id: any;
            title: any;
            category: any;
            city: any;
            deadline: any;
            createdAt: any;
            companyId: any;
            companyName: any;
        }[];
    }>;
    static jobDetail(params: {
        companyId: number;
        jobId: number;
        requesterId: number;
        requesterRole: UserRole;
    }): Promise<{
        id: number;
        title: string;
        description: string;
        banner: string | null;
        category: string;
        city: string;
        salaryMin: number | null;
        salaryMax: number | null;
        tags: string[];
        applicationDeadline: Date | null;
        isPublished: boolean;
        createdAt: Date;
        applicantsCount: any;
        applicants: {
            applicationId: number;
            userId: number;
            userName: any;
            userEmail: any;
            score: number | null;
            preselectionPassed: boolean | undefined;
            status: import("../../generated/prisma").$Enums.ApplicationStatus;
            appliedAt: Date;
        }[];
    }>;
}
//# sourceMappingURL=job.service.d.ts.map