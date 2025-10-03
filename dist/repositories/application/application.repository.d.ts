export declare class ApplicationRepo {
    static createApplication(data: {
        userId: number;
        jobId: string;
        cvFile: string;
        expectedSalary?: number;
    }): Promise<{
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
    static findExisting(userId: number, jobId: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        status: import("../../generated/prisma").$Enums.ApplicationStatus;
        jobId: string;
        cvFile: string;
        expectedSalary: number | null;
        reviewNote: string | null;
    } | null>;
    static getApplicationWithOwnership(applicationId: number): Promise<({
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
            city: string | null;
            id: number;
        };
        job: {
            company: {
                name: string;
                email: string | null;
                phone: string | null;
                createdAt: Date;
                updatedAt: Date;
                city: string | null;
                id: string;
                location: string | null;
                description: string | null;
                website: string | null;
                logo: string | null;
                adminId: number | null;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            city: string;
            id: string;
            companyId: string;
            description: string;
            title: string;
            category: string;
            salaryMin: number | null;
            salaryMax: number | null;
            tags: string[];
            banner: string | null;
            deadline: Date | null;
            isPublished: boolean;
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
    }) | null>;
    static updateApplicationStatus(applicationId: number, status: any, reviewNote?: string | null): Promise<{
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
//# sourceMappingURL=application.repository.d.ts.map