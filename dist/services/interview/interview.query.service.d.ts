import { InterviewStatus, UserRole } from "../../generated/prisma";
export declare class InterviewQueryService {
    static list(params: {
        companyId: number;
        requesterId: number;
        requesterRole: UserRole;
        query: {
            jobId?: number;
            applicantId?: number;
            status?: InterviewStatus;
            dateFrom?: string;
            dateTo?: string;
            limit?: number;
            offset?: number;
        };
    }): Promise<{
        items: ({
            application: {
                user: {
                    role: import("../../generated/prisma").$Enums.UserRole;
                    name: string;
                    email: string;
                    passwordHash: string;
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
                    company: {
                        admin: {
                            role: import("../../generated/prisma").$Enums.UserRole;
                            name: string;
                            email: string;
                            passwordHash: string;
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
                        } | null;
                    } & {
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
                    };
                } & {
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
        })[];
        total: number;
        limit: number;
        offset: number;
    }>;
    static detail(params: {
        companyId: number;
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