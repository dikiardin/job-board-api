export declare class ApplicationService {
    static submitApplicationBySlug(userId: number, jobSlug: string, file: Express.Multer.File, expectedSalary?: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        status: import("../../generated/prisma").$Enums.ApplicationStatus;
        jobId: number;
        cvUrl: string;
        cvFileName: string | null;
        cvFileSize: number | null;
        expectedSalary: number | null;
        expectedSalaryCurrency: string | null;
        reviewNote: string | null;
        reviewUpdatedAt: Date | null;
        referralSource: string | null;
        isPriority: boolean;
    }>;
    static getApplicationsByUserId(userId: number, page?: number, limit?: number): Promise<{
        applications: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            status: import("../../generated/prisma").$Enums.ApplicationStatus;
            job: {
                city: string;
                id: number;
                company: {
                    name: string;
                    id: number;
                    slug: string;
                    logoUrl: string | null;
                };
                slug: string;
                title: string;
                category: string;
                salaryMin: number | null;
                salaryMax: number | null;
            };
            jobId: number;
            cvUrl: string;
            cvFileName: string | null;
            cvFileSize: number | null;
            expectedSalary: number | null;
            expectedSalaryCurrency: string | null;
            reviewNote: string | null;
            reviewUpdatedAt: Date | null;
            referralSource: string | null;
            isPriority: boolean;
            interviews: {
                createdAt: Date;
                updatedAt: Date;
                id: number;
                status: import("../../generated/prisma").$Enums.InterviewStatus;
                notes: string | null;
                applicationId: number;
                createdById: number | null;
                startsAt: Date;
                endsAt: Date | null;
                locationOrLink: string | null;
                reminderSentAt: Date | null;
                updatedById: number | null;
            }[];
            timeline: {
                createdAt: Date;
                id: number;
                status: import("../../generated/prisma").$Enums.ApplicationStatus;
                applicationId: number;
                note: string | null;
                createdById: number | null;
            }[];
        }[];
        total: number;
    }>;
}
//# sourceMappingURL=application.service.d.ts.map