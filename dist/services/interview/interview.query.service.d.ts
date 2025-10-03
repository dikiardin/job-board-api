import { InterviewStatus, UserRole } from "../../generated/prisma";
export declare class InterviewQueryService {
    static list(params: {
        companyId: string | number;
        requesterId: number;
        requesterRole: UserRole;
        query: {
            jobId?: string | number;
            applicantId?: number;
            status?: InterviewStatus;
            dateFrom?: string;
            dateTo?: string;
            limit?: number;
            offset?: number;
        };
    }): Promise<{
        total: number;
        limit: number;
        offset: number;
        items: {
            id: any;
            applicationId: any;
            scheduleDate: any;
            locationOrLink: any;
            notes: any;
            status: any;
            candidateName: any;
            jobTitle: any;
        }[];
    }>;
    static detail(params: {
        companyId: string;
        id: number;
        requesterId: number;
        requesterRole: UserRole;
    }): Promise<{
        application: {
            job: {
                company: {
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
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        status: import("../../generated/prisma").$Enums.InterviewStatus;
        applicationId: number;
        scheduleDate: Date;
        locationOrLink: string | null;
        notes: string | null;
        reminderSentAt: Date | null;
    }>;
}
//# sourceMappingURL=interview.query.service.d.ts.map