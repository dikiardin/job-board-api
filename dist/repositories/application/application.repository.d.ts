export declare class ApplicationRepo {
    static createApplication(data: {
        userId: number;
        jobId: number | string;
        cvUrl: string;
        cvFileName?: string | null;
        cvFileSize?: number | null;
        expectedSalary?: number;
        isPriority?: boolean;
    }): Promise<{
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
    static findExisting(userId: number, jobId: number | string): Promise<{
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
    } | null>;
    static getApplicationWithOwnership(applicationId: number): Promise<({
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
        job: {
            company: {
                email: string;
                name: string;
                phone: string | null;
                address: string | null;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                slug: string;
                description: string | null;
                logoUrl: string | null;
                bannerUrl: string | null;
                website: string | null;
                locationCity: string | null;
                locationProvince: string | null;
                locationCountry: string | null;
                socials: import("../../generated/prisma/runtime/library").JsonValue | null;
                ownerAdminId: number | null;
            };
        } & {
            city: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            companyId: number;
            slug: string;
            description: string;
            bannerUrl: string | null;
            title: string;
            category: string;
            employmentType: string | null;
            experienceLevel: string | null;
            province: string | null;
            salaryMin: number | null;
            salaryMax: number | null;
            salaryCurrency: string | null;
            tags: string[];
            applyDeadline: Date | null;
            isPublished: boolean;
            publishedAt: Date | null;
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
        isPriority: boolean;
    }) | null>;
    static updateApplicationStatus(applicationId: number, status: any, reviewNote?: string | null): Promise<{
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
            timeline: {
                createdAt: Date;
                id: number;
                status: import("../../generated/prisma").$Enums.ApplicationStatus;
                applicationId: number;
                note: string | null;
                createdById: number | null;
            }[];
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
        }[];
        total: number;
    }>;
    static getApplicationsForEmployer(companyId: number, page?: number, limit?: number, status?: string): Promise<{
        applications: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            user: {
                email: string;
                name: string | null;
                phone: string | null;
                profilePicture: string | null;
                id: number;
            };
            userId: number;
            status: import("../../generated/prisma").$Enums.ApplicationStatus;
            job: {
                id: number;
                slug: string;
                title: string;
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
//# sourceMappingURL=application.repository.d.ts.map