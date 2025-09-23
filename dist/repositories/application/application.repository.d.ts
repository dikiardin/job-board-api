export declare class ApplicationRepository {
    static createApplication(params: {
        userId: number;
        jobId: number;
        cvFile: string;
        expectedSalary?: number;
    }): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        status: import("../../generated/prisma").$Enums.ApplicationStatus;
        jobId: number;
        cvFile: string;
        expectedSalary: number | null;
        reviewNote: string | null;
    }>;
    static getPreselectionTestByJob(jobId: number): Promise<({
        results: {
            createdAt: Date;
            id: number;
            userId: number;
            testId: number;
            score: number;
        }[];
    } & {
        createdAt: Date;
        id: number;
        isActive: boolean;
        jobId: number;
        passingScore: number | null;
    }) | null>;
    static getPreselectionResult(userId: number, testId: number): Promise<{
        createdAt: Date;
        id: number;
        userId: number;
        testId: number;
        score: number;
    } | null>;
}
//# sourceMappingURL=application.repository.d.ts.map