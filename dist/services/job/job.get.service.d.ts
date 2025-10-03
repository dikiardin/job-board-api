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
            companyName: any;
            companyLogo: any;
        }[];
        total: number;
    }>;
    static getJobById(jobId: string): Promise<{
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