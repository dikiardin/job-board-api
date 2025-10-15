import { Prisma } from "../../generated/prisma";
export declare class AnalyticsRepository {
    static getCompany(companyId: string | number): Promise<{
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
        socials: Prisma.JsonValue | null;
        ownerAdminId: number | null;
    } | null>;
    static getCompanyApplications(params: {
        companyId: string | number;
        from?: Date;
        to?: Date;
    }): Promise<({
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
    })[]>;
    static applicationStatusCounts(params: {
        companyId: string | number;
        from?: Date;
        to?: Date;
    }): Promise<(Prisma.PickEnumerable<Prisma.ApplicationGroupByOutputType, "status"[]> & {
        _count: {
            status: number;
        };
    })[]>;
    static applicationsByCategory(params: {
        companyId: string | number;
        from?: Date;
        to?: Date;
    }): Promise<{
        category: string;
        count: number;
    }[]>;
    static expectedSalaryByCityAndTitle(params: {
        companyId: string | number;
        from?: Date;
        to?: Date;
    }): Promise<{
        city: string;
        title: string;
        avgExpectedSalary: number;
        samples: number;
    }[]>;
    static topCitiesByApplications(params: {
        companyId: string | number;
        from?: Date;
        to?: Date;
    }): Promise<{
        city: string;
        count: number;
    }[]>;
    static companyReviewSalaryStats(companyId: string | number): Promise<{
        avgSalaryEstimate: number | null;
        samples: number;
    }>;
    static dailyActiveUsers(params: {
        companyId: string | number;
        from?: Date;
        to?: Date;
    }): Promise<{
        count: number;
        trend: number;
    }>;
    static monthlyActiveUsers(params: {
        companyId: string | number;
        from?: Date;
        to?: Date;
    }): Promise<{
        count: number;
        trend: number;
    }>;
    static sessionMetrics(params: {
        companyId: string | number;
        from?: Date;
        to?: Date;
    }): Promise<{
        averageSessionDuration: number;
        bounceRate: number;
        sessionsPerUser: number;
    }>;
    static pageViews(params: {
        companyId: string | number;
        from?: Date;
        to?: Date;
    }): Promise<{
        total: number;
        unique: number;
        topPages: never[];
    }>;
    static conversionFunnelData(params: {
        companyId: string | number;
        from?: Date;
        to?: Date;
    }): Promise<{
        steps: {
            name: string;
            count: number;
            percentage: number;
        }[];
    }>;
    static retentionData(params: {
        companyId: string | number;
        from?: Date;
        to?: Date;
    }): Promise<{
        day1: number;
        day7: number;
        day30: number;
        cohorts: never[];
    }>;
    static performanceData(params: {
        companyId: string | number;
        from?: Date;
        to?: Date;
    }): Promise<{
        averageLoadTime: number;
        errorRate: number;
        uptime: number;
        mobileVsDesktop: {
            mobile: number;
            desktop: number;
        };
    }>;
}
//# sourceMappingURL=analytics.repository.d.ts.map