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
    static updateOne(id: number, data: Partial<{
        scheduleDate: Date;
        locationOrLink: string | null;
        notes: string | null;
        status: InterviewStatus;
    }>): Promise<{
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
    static deleteOne(id: number): Promise<{
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
    static getById(id: number): Promise<{
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
    } | null>;
    static list(params: {
        companyId: string | number;
        jobId?: string | number;
        applicantId?: number;
        status?: InterviewStatus;
        dateFrom?: Date;
        dateTo?: Date;
        limit?: number;
        offset?: number;
    }): Promise<{
        items: {
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
        total: number;
        limit: number;
        offset: number;
    }>;
    static findConflicts(applicationId: number, start: Date, end: Date): Promise<{
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
    } | null>;
    static getDueReminders(windowStart: Date, windowEnd: Date): Promise<{
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
    }[]>;
    static markReminderSent(id: number): Promise<{
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
//# sourceMappingURL=interview.repository.d.ts.map