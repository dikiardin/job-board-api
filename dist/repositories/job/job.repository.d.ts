export declare class JobRepository {
    static getCompany(companyId: string | number): Promise<{
        name: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        city: string | null;
        id: number;
        location: string | null;
        description: string | null;
        website: string | null;
        logo: string | null;
        adminId: number | null;
    } | null>;
    static createJob(companyId: string | number, data: {
        title: string;
        description: string;
        banner?: string | null;
        category: string;
        city: string;
        salaryMin?: number | null;
        salaryMax?: number | null;
        tags: string[];
        deadline?: Date | null;
        isPublished?: boolean;
    }): Promise<{
        createdAt: Date;
        updatedAt: Date;
        city: string;
        id: number;
        companyId: number;
        description: string;
        title: string;
        category: string;
        salaryMin: number | null;
        salaryMax: number | null;
        tags: string[];
        banner: string | null;
        deadline: Date | null;
        isPublished: boolean;
    }>;
    static updateJob(companyId: string | number, jobId: string | number, data: Partial<{
        title: string;
        description: string;
        banner?: string | null;
        category: string;
        city: string;
        salaryMin?: number | null;
        salaryMax?: number | null;
        tags: string[];
        deadline?: Date | null;
        isPublished?: boolean;
    }>): Promise<{
        createdAt: Date;
        updatedAt: Date;
        city: string;
        id: number;
        companyId: number;
        description: string;
        title: string;
        category: string;
        salaryMin: number | null;
        salaryMax: number | null;
        tags: string[];
        banner: string | null;
        deadline: Date | null;
        isPublished: boolean;
    }>;
    static getJobById(companyId: string | number, jobId: string | number): Promise<({
        applications: ({
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
        _count: {
            applications: number;
        };
        preselectionTests: ({
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
        }) | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        city: string;
        id: number;
        companyId: number;
        description: string;
        title: string;
        category: string;
        salaryMin: number | null;
        salaryMax: number | null;
        tags: string[];
        banner: string | null;
        deadline: Date | null;
        isPublished: boolean;
    }) | null>;
    static togglePublish(jobId: string | number, isPublished: boolean): Promise<{
        createdAt: Date;
        updatedAt: Date;
        city: string;
        id: number;
        companyId: number;
        description: string;
        title: string;
        category: string;
        salaryMin: number | null;
        salaryMax: number | null;
        tags: string[];
        banner: string | null;
        deadline: Date | null;
        isPublished: boolean;
    }>;
    static deleteJob(companyId: string | number, jobId: string | number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        city: string;
        id: number;
        companyId: number;
        description: string;
        title: string;
        category: string;
        salaryMin: number | null;
        salaryMax: number | null;
        tags: string[];
        banner: string | null;
        deadline: Date | null;
        isPublished: boolean;
    }>;
    static listJobs(params: {
        companyId: string | number;
        title?: string;
        category?: string;
        sortBy?: "createdAt" | "deadline";
        sortOrder?: "asc" | "desc";
        limit?: number;
        offset?: number;
    }): Promise<{
        items: ({
            _count: {
                applications: number;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            city: string;
            id: number;
            companyId: number;
            description: string;
            title: string;
            category: string;
            salaryMin: number | null;
            salaryMax: number | null;
            tags: string[];
            banner: string | null;
            deadline: Date | null;
            isPublished: boolean;
        })[];
        total: number;
        limit: number;
        offset: number;
    }>;
    static listPublishedJobs(params: {
        title?: string;
        category?: string;
        city?: string;
        sortBy?: "createdAt" | "deadline";
        sortOrder?: "asc" | "desc";
        limit?: number;
        offset?: number;
    }): Promise<{
        items: {
            createdAt: Date;
            updatedAt: Date;
            city: string;
            id: number;
            companyId: number;
            description: string;
            title: string;
            category: string;
            salaryMin: number | null;
            salaryMax: number | null;
            tags: string[];
            banner: string | null;
            deadline: Date | null;
            isPublished: boolean;
        }[];
        total: number;
        limit: number;
        offset: number;
    }>;
    static getJobPublic(jobId: string | number): Promise<{
        id: number;
        companyId: number;
        title: string;
        deadline: Date | null;
        isPublished: boolean;
    } | null>;
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
//# sourceMappingURL=job.repository.d.ts.map