export declare class GetJobService {
    static getAllJobs(filters?: {
        keyword?: string;
        city?: string;
        limit?: number;
        offset?: number;
        sortBy?: "createdAt";
        sortOrder?: "asc" | "desc";
        postedWithin?: "1" | "3" | "7" | "30";
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
            createdAt: Date;
        }[];
        total: number;
    }>;
    static getJobBySlug(slug: string): Promise<{
        company: {
            email: string;
            name: string;
            phone: string | null;
            address: string | null;
            id: number;
            slug: string;
            description: string | null;
            logoUrl: string | null;
            website: string | null;
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