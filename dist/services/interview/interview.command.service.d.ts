import { InterviewStatus, UserRole } from "../../generated/prisma";
export declare class InterviewCommandService {
    static createMany(params: {
        companyId: number;
        jobId: number;
        requesterId: number;
        requesterRole: UserRole;
        body: {
            items: Array<{
                applicantId: number;
                scheduleDate: string | Date;
                locationOrLink?: string | null;
                notes?: string | null;
            }>;
        };
    }): Promise<any[]>;
    private static validateAdminAccess;
    private static getApplicationsForJob;
    private static prepareInterviewSchedules;
    private static createInterviewSchedules;
    private static updateApplicationStatuses;
    private static sendInterviewNotifications;
    private static sendInterviewEmails;
    static update(params: {
        id: number;
        requesterId: number;
        requesterRole: UserRole;
        body: {
            scheduleDate?: string | Date;
            locationOrLink?: string | null;
            notes?: string | null;
            status?: InterviewStatus;
        };
    }): Promise<any>;
    static remove(params: {
        id: number;
        requesterId: number;
        requesterRole: UserRole;
    }): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=interview.command.service.d.ts.map