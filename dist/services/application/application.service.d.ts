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
    static getApplicationsByUserId(userId: number): Promise<({
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
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        status: import("../../generated/prisma").$Enums.ApplicationStatus;
        jobId: number;
        cvFile: string;
        expectedSalary: number | null;
        reviewNote: string | null;
    })[]>;
}
//# sourceMappingURL=application.service.d.ts.map