import { UserRole } from "../../generated/prisma";
export declare class AnalyticsService {
    static assertCompanyOwnership(companyId: string | number, requesterId: number, requesterRole: UserRole): Promise<{
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
    }>;
    static demographics(params: {
        companyId: string | number;
        requesterId: number;
        requesterRole: UserRole;
        query: {
            from?: string;
            to?: string;
        };
    }): Promise<{
        ageBuckets: Record<string, number>;
        gender: {
            gender: string;
            count: number;
        }[];
        locations: {
            city: string;
            count: number;
        }[];
        totalApplicants: number;
    }>;
    static salaryTrends(params: {
        companyId: string | number;
        requesterId: number;
        requesterRole: UserRole;
        query: {
            from?: string;
            to?: string;
        };
    }): Promise<{
        expectedSalary: {
            city: string;
            title: string;
            avgExpectedSalary: number;
            samples: number;
        }[];
        reviewSalary: {
            avgSalaryEstimate: number | null;
            samples: number;
        };
    }>;
    static interests(params: {
        companyId: string | number;
        requesterId: number;
        requesterRole: UserRole;
        query: {
            from?: string;
            to?: string;
        };
    }): Promise<{
        byCategory: {
            category: string;
            count: number;
        }[];
    }>;
    static overview(params: {
        companyId: string | number;
        requesterId: number;
        requesterRole: UserRole;
        query: {
            from?: string;
            to?: string;
        };
    }): Promise<{
        totals: {
            usersTotal: number;
            jobsTotal: number;
            applicationsTotal: number;
        };
        applicationStatus: {
            status: import("../../generated/prisma").$Enums.ApplicationStatus;
            count: number;
        }[];
        topCities: {
            city: string;
            count: number;
        }[];
    }>;
}
//# sourceMappingURL=analytics.service.d.ts.map