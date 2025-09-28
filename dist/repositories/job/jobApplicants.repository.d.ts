export declare class JobApplicantsRepository {
    static listApplicantsForJob(params: {
        companyId: number;
        jobId: number;
        name?: string;
        education?: string;
        ageMin?: number;
        ageMax?: number;
        expectedSalaryMin?: number;
        expectedSalaryMax?: number;
        sortBy?: "appliedAt" | "expectedSalary" | "age";
        sortOrder?: "asc" | "desc";
        limit?: number;
        offset?: number;
    }): Promise<{
        items: ({
            user: {
                role: import("../../generated/prisma").$Enums.UserRole;
                name: string;
                email: string;
                passwordHash: string | null;
                phone: string | null;
                gender: string | null;
                dob: Date | null;
                education: string | null;
                address: string | null;
                profilePicture: string | null;
                isVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                id: number;
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
        })[];
        total: number;
        limit: number;
        offset: number;
    }>;
}
//# sourceMappingURL=jobApplicants.repository.d.ts.map