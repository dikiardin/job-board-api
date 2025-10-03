import { InterviewStatus } from "../../generated/prisma";
export declare class InterviewRepository {
    static createMany(interviews: Array<{
        applicationId: number;
        scheduleDate: Date;
        locationOrLink?: string | null;
        notes?: string | null;
    }>): Promise<any[]>;
    static createOne(data: {
        applicationId: number;
        scheduleDate: Date;
        locationOrLink?: string | null;
        notes?: string | null;
    }): Promise<{
        application: {
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
                    admin: {
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
                    } | null;
                } & {
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
    static updateOne(id: number, data: Partial<{
        scheduleDate: Date;
        locationOrLink: string | null;
        notes: string | null;
        status: InterviewStatus;
    }>): Promise<{
        application: {
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
                    admin: {
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
                    } | null;
                } & {
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
    static deleteOne(id: number): Promise<{
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
    static getById(id: number): Promise<({
        application: {
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
                    admin: {
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
                    } | null;
                } & {
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
    }) | null>;
    static list(params: {
        companyId: string;
        jobId?: string;
        applicantId?: number;
        status?: InterviewStatus;
        dateFrom?: Date;
        dateTo?: Date;
        limit?: number;
        offset?: number;
    }): Promise<{
        items: ({
            application: {
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
                        admin: {
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
                        } | null;
                    } & {
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
    static findConflicts(applicationId: number, start: Date, end: Date): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        status: import("../../generated/prisma").$Enums.InterviewStatus;
        applicationId: number;
        scheduleDate: Date;
        locationOrLink: string | null;
        notes: string | null;
        reminderSentAt: Date | null;
    } | null>;
    static getDueReminders(windowStart: Date, windowEnd: Date): Promise<({
        application: {
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
                    admin: {
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
                    } | null;
                } & {
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
    })[]>;
    static markReminderSent(id: number): Promise<{
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
//# sourceMappingURL=interview.repository.d.ts.map