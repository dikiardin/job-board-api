export declare class ApplicationService {
    static submitApplication(userId: number, jobId: string, file: Express.Multer.File, expectedSalary?: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        status: import("../../generated/prisma").$Enums.ApplicationStatus;
        jobId: string;
        cvFile: string;
        expectedSalary: number | null;
        reviewNote: string | null;
    }>;
    static getApplicationsByUserId(userId: number): Promise<({
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
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        status: import("../../generated/prisma").$Enums.ApplicationStatus;
        jobId: string;
        cvFile: string;
        expectedSalary: number | null;
        reviewNote: string | null;
    })[]>;
}
//# sourceMappingURL=application.service.d.ts.map