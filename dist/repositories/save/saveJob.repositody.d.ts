export declare class SavedJobRepo {
    static saveJob(userId: number, jobId: string | number): Promise<{
        createdAt: Date;
        id: number;
        userId: number;
        jobId: number;
    }>;
    static getSavedJobsByUser(userId: number): Promise<{
        createdAt: Date;
        id: number;
        userId: number;
        jobId: number;
    }[]>;
    static unsaveJob(userId: number, jobId: string | number): Promise<{
        createdAt: Date;
        id: number;
        userId: number;
        jobId: number;
    }>;
}
//# sourceMappingURL=saveJob.repositody.d.ts.map