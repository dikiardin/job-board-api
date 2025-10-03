export declare class SavedJobService {
    static saveJob(userId: number, jobId: string): Promise<{
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
    static unsaveJob(userId: number, jobId: string): Promise<{
        createdAt: Date;
        id: number;
        userId: number;
        jobId: number;
    }>;
}
//# sourceMappingURL=saveJob.service.d.ts.map