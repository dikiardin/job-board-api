export declare class GetJobService {
    static getAllJobs(filters?: {
        keyword?: string;
        city?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        jobs: {
            id: number;
            title: string;
            category: string;
            city: string;
            tags: string[];
            salary: string;
            companyName: string;
            companyLogo: string | null;
        }[];
        total: number;
    }>;
    static getJobById(jobId: number): Promise<{
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
    }>;
}
//# sourceMappingURL=job.get.service.d.ts.map