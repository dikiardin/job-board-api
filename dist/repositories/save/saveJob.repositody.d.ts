export declare class SavedJobRepo {
    static saveJob(userId: number, jobId: string | number): Promise<{
        job: {
            city: string;
            id: number;
            company: {
                name: string;
                id: number;
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
        jobId: number;
    }>;
    static getSavedJobsByUser(userId: number): Promise<({
        job: {
            city: string;
            id: number;
            company: {
                name: string;
                id: number;
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
        jobId: number;
    })[]>;
    static unsaveJob(userId: number, jobId: string | number): Promise<{
        createdAt: Date;
        id: number;
        userId: number;
        jobId: number;
    }>;
}
//# sourceMappingURL=saveJob.repositody.d.ts.map