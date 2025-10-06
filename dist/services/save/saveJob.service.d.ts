export declare class SavedJobService {
    static saveJob(userId: number, jobId: string): Promise<{
        job: {
            city: string;
            id: number;
            company: {
                name: string;
                id: number;
                logoUrl: string | null;
            };
            title: string;
            category: string;
            salaryMin: number | null;
            salaryMax: number | null;
            tags: string[];
        };
    } & {
        createdAt: Date;
        id: number;
        userId: number;
        jobId: number;
    }>;
    static getSavedJobsByUser(userId: number, page: number, limit: number): Promise<{
        jobs: ({
            job: {
                city: string;
                id: number;
                company: {
                    name: string;
                    id: number;
                    logoUrl: string | null;
                };
                slug: string;
                title: string;
                category: string;
                salaryMin: number | null;
                salaryMax: number | null;
                tags: string[];
            };
        } & {
            createdAt: Date;
            id: number;
            userId: number;
            jobId: number;
        })[];
        total: number;
    }>;
    static unsaveJob(userId: number, jobId: string): Promise<{
        createdAt: Date;
        id: number;
        userId: number;
        jobId: number;
    }>;
}
//# sourceMappingURL=saveJob.service.d.ts.map