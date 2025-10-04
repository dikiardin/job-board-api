export declare class GetJobRepository {
    static getAllJobs(filters?: {
        keyword?: string;
        city?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        city: string;
        id: number;
        company: {
            name: string;
            logoUrl: string | null;
        };
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
    static findById(jobId: string | number): Promise<({
        company: {
            name: string;
            id: number;
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
    }) | null>;
}
//# sourceMappingURL=job.get.repository.d.ts.map