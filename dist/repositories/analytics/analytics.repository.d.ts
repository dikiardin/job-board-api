import { Prisma } from "../../generated/prisma";
export declare class AnalyticsRepository {
    static getCompany(companyId: number): Promise<{
        name: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        location: string | null;
        description: string | null;
        website: string | null;
        logo: string | null;
        adminId: number | null;
    } | null>;
    static getCompanyApplications(params: {
        companyId: number;
        from?: Date;
        to?: Date;
    }): Promise<({
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
        job: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            companyId: number;
            description: string;
            title: string;
            category: string;
            city: string;
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
        jobId: number;
        cvFile: string;
        expectedSalary: number | null;
        reviewNote: string | null;
    })[]>;
    static applicationStatusCounts(params: {
        companyId: number;
        from?: Date;
        to?: Date;
    }): Promise<(Prisma.PickEnumerable<Prisma.ApplicationGroupByOutputType, "status"[]> & {
        _count: {
            status: number;
        };
    })[]>;
    static applicationsByCategory(params: {
        companyId: number;
        from?: Date;
        to?: Date;
    }): Promise<{
        category: string;
        count: number;
    }[]>;
    static expectedSalaryByCityAndTitle(params: {
        companyId: number;
        from?: Date;
        to?: Date;
    }): Promise<{
        city: string;
        title: string;
        avgExpectedSalary: number;
        samples: number;
    }[]>;
    static topCitiesByApplications(params: {
        companyId: number;
        from?: Date;
        to?: Date;
    }): Promise<{
        city: string;
        count: number;
    }[]>;
    static companyReviewSalaryStats(companyId: number): Promise<{
        avgSalaryEstimate: number | null;
        samples: number;
    }>;
}
//# sourceMappingURL=analytics.repository.d.ts.map