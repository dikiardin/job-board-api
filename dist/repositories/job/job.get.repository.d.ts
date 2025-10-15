export interface JobFilters {
    keyword?: string | undefined;
    city?: string | undefined;
    limit?: number;
    offset?: number;
    sortBy?: "createdAt";
    sortOrder?: "asc" | "desc";
    postedWithin?: "1" | "3" | "7" | "30";
}
export declare class GetJobRepository {
    static getAllJobs(filters?: JobFilters): Promise<{
        city: string;
        createdAt: Date;
        id: number;
        company: {
            name: string;
            logoUrl: string | null;
        };
        slug: string;
        title: string;
        category: string;
        salaryMin: number | null;
        salaryMax: number | null;
        tags: string[];
    }[]>;
    static countJobs(filters?: {
        keyword?: string;
        city?: string;
    }): Promise<number>;
    static findBySlug(slug: string): Promise<({
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
    }) | null>;
}
//# sourceMappingURL=job.get.repository.d.ts.map