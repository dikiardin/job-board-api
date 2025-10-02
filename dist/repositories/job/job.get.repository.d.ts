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
            logo: string | null;
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
    static findById(jobId: number): Promise<({
        company: {
            name: string;
            id: number;
            location: string | null;
            logo: string | null;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        city: string;
        id: number;
        companyId: number;
        description: string;
        title: string;
        category: string;
        salaryMin: number | null;
        salaryMax: number | null;
        tags: string[];
        banner: string | null;
        deadline: Date | null;
        isPublished: boolean;
    }) | null>;
}
//# sourceMappingURL=job.get.repository.d.ts.map