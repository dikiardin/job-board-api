import { UserRole } from "../../generated/prisma";
export declare class JobService {
    static assertCompanyOwnership(companyId: string, requesterId: number): Promise<{
        name: string;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        bannerUrl: string | null;
        website: string | null;
        locationCity: string | null;
        locationProvince: string | null;
        locationCountry: string | null;
        socials: import("../../generated/prisma/runtime/library").JsonValue | null;
        ownerAdminId: number | null;
    }>;
    static validateJobPayload(payload: any, isUpdate?: boolean): void;
    static createJob(params: {
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
    }): Promise<{
        city: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        companyId: number;
        slug: string;
        description: string;
        bannerUrl: string | null;
        title: string;
        category: string;
        employmentType: string | null;
        experienceLevel: string | null;
        province: string | null;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string | null;
        tags: string[];
        applyDeadline: Date | null;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    static updateJob(params: {
        companyId: string;
        jobId: string;
        requesterId: number;
        requesterRole: UserRole;
        body: any;
    }): Promise<{
        city: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        companyId: number;
        slug: string;
        description: string;
        bannerUrl: string | null;
        title: string;
        category: string;
        employmentType: string | null;
        experienceLevel: string | null;
        province: string | null;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string | null;
        tags: string[];
        applyDeadline: Date | null;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    static togglePublish(params: {
        companyId: string;
        jobId: string;
        requesterId: number;
        requesterRole: UserRole;
        isPublished?: boolean;
    }): Promise<{
        city: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        companyId: number;
        slug: string;
        description: string;
        bannerUrl: string | null;
        title: string;
        category: string;
        employmentType: string | null;
        experienceLevel: string | null;
        province: string | null;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string | null;
        tags: string[];
        applyDeadline: Date | null;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    static deleteJob(params: {
        companyId: string;
        jobId: string;
        requesterId: number;
        requesterRole: UserRole;
    }): Promise<{
        success: boolean;
    }>;
    static listJobs(params: {
        companyId: string;
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
        total: any;
        limit: any;
        offset: any;
        items: any;
    }>;
    private static validateAdminAccess;
    private static buildQueryParams;
    private static formatJobListResponse;
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
        companyId: string;
        jobId: string;
        requesterId: number;
        requesterRole: UserRole;
    }): Promise<{
        id: number;
        title: string;
        description: string;
        banner: any;
        category: string;
        city: string;
        salaryMin: number | null;
        salaryMax: number | null;
        tags: string[];
        deadline: any;
        isPublished: boolean;
        createdAt: Date;
        applicantsCount: any;
        applicants: any;
    }>;
}
//# sourceMappingURL=job.service.d.ts.map