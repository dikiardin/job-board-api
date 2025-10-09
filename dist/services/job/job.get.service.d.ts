export declare class GetJobService {
    static getAllJobs(filters?: {
        keyword?: string;
        city?: string;
        limit?: number;
        offset?: number;
        sortBy?: "createdAt";
        sortOrder?: "asc" | "desc";
    }): Promise<{
        jobs: {
            id: number;
            slug: string;
            title: string;
            category: string;
            city: string;
            tags: string[];
            salary: string;
            companyName: any;
            companyLogo: any;
        }[];
        total: number;
    }>;
    static getJobBySlug(slug: string): Promise<{
        company: {
            name: string;
            id: number;
            slug: string;
            logoUrl: string | null;
            locationCity: string | null;
        };
    } & {
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
}
//# sourceMappingURL=job.get.service.d.ts.map