export declare function buildInterviewEmail(params: {
    type: "created" | "updated" | "cancelled" | "reminder";
    candidateName: string;
    adminName?: string | null;
    jobTitle: string;
    companyName: string;
    scheduleDate: Date;
    locationOrLink?: string | null;
    notes?: string | null;
}): string;
//# sourceMappingURL=emailTemplateInterview.d.ts.map