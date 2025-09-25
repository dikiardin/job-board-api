export declare class ApplicationService {
    static submitApplication(userId: number, jobId: number, file: Express.Multer.File, expectedSalary?: number): Promise<{
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
}
//# sourceMappingURL=application.service.d.ts.map