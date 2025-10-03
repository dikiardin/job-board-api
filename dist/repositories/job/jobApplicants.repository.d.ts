export declare class JobApplicantsRepository {
    static listApplicantsForJob(params: {
        companyId: string | number;
        jobId: string | number;
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
                email: string;
                passwordHash: string | null;
                name: string | null;
                phone: string | null;
                gender: string | null;
                dob: Date | null;
                education: string | null;
                address: string | null;
                city: string | null;
                profilePicture: string | null;
                emailVerifiedAt: Date | null;
                verificationToken: string | null;
                verificationTokenExpiresAt: Date | null;
                passwordResetToken: string | null;
                passwordResetExpiresAt: Date | null;
                emailChangeToken: string | null;
                emailChangeNewEmail: string | null;
                emailChangeExpiresAt: Date | null;
                lastLoginAt: Date | null;
                isActive: boolean;
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
            cvUrl: string;
            cvFileName: string | null;
            cvFileSize: number | null;
            expectedSalary: number | null;
            expectedSalaryCurrency: string | null;
            reviewNote: string | null;
            reviewUpdatedAt: Date | null;
            referralSource: string | null;
        })[];
        total: number;
        limit: number;
        offset: number;
    }>;
}
//# sourceMappingURL=jobApplicants.repository.d.ts.map