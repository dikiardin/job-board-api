export declare class InterviewEmailService {
    static sendCandidateEmail(params: {
        type: "created" | "updated" | "cancelled" | "reminder";
        to: string;
        candidateName: string;
        adminName?: string | null;
        jobTitle: string;
        companyName: string;
        scheduleDate: Date;
        locationOrLink?: string | null;
        notes?: string | null;
    }): Promise<void>;
    static sendAdminEmail(params: {
        type: "created" | "updated" | "cancelled" | "reminder";
        to: string;
        adminName: string;
        candidateName: string;
        jobTitle: string;
        companyName: string;
        scheduleDate: Date;
        locationOrLink?: string | null;
        notes?: string | null;
    }): Promise<void>;
}
//# sourceMappingURL=interviewEmail.service.d.ts.map