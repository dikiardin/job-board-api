export declare class SavedJobRepo {
    static saveJob(userId: number, jobId: string): Promise<{
        job: {
            city: string;
            id: string;
            company: {
                name: string;
                id: string;
                logo: string | null;
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
        jobId: string;
    }>;
    static getSavedJobsByUser(userId: number): Promise<({
        job: {
            city: string;
            id: string;
            company: {
                name: string;
                id: string;
                logo: string | null;
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
        jobId: string;
    })[]>;
    static unsaveJob(userId: number, jobId: string): Promise<{
        createdAt: Date;
        id: number;
        userId: number;
        jobId: string;
    }>;
}
//# sourceMappingURL=saveJob.repositody.d.ts.map