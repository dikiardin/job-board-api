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
        };
    } & {
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
    }>;
}
//# sourceMappingURL=interview.query.service.d.ts.map