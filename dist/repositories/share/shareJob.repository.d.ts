export declare const SharePlatform: {
    readonly WHATSAPP: "WHATSAPP";
    readonly LINKEDIN: "LINKEDIN";
    readonly FACEBOOK: "FACEBOOK";
    readonly TWITTER: "TWITTER";
};
export type SharePlatform = (typeof SharePlatform)[keyof typeof SharePlatform];
export declare class JobShareRepo {
    static createShare(userId: number, jobId: string, platform: SharePlatform, sharedUrl?: string, customMessage?: string): Promise<{
        createdAt: Date;
        id: number;
        userId: number;
        jobId: string;
        platform: import("../../generated/prisma").$Enums.SharePlatform;
        sharedUrl: string | null;
        customMessage: string | null;
    }>;
    static findSharesByJob(jobId: string): Promise<({
        user: {
            name: string;
            id: number;
        };
        job: {
            id: string;
            title: string;
        };
    } & {
        createdAt: Date;
        id: number;
        userId: number;
        jobId: string;
        platform: import("../../generated/prisma").$Enums.SharePlatform;
        sharedUrl: string | null;
        customMessage: string | null;
    })[]>;
}
//# sourceMappingURL=shareJob.repository.d.ts.map