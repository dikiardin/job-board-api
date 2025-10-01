import { SharePlatform } from "../../repositories/share/shareJob.repository";
export declare class JobShareService {
    static shareJob(userId: number, jobId: number, platform: SharePlatform, sharedUrl?: string, customMessage?: string): Promise<{
        createdAt: Date;
        id: number;
        userId: number;
        jobId: number;
        platform: import("../../generated/prisma").$Enums.SharePlatform;
        sharedUrl: string | null;
        customMessage: string | null;
    }>;
    static getSharesByJob(jobId: number): Promise<({
        user: {
            name: string;
            id: number;
        };
        job: {
            id: number;
            title: string;
        };
    } & {
        createdAt: Date;
        id: number;
        userId: number;
        jobId: number;
        platform: import("../../generated/prisma").$Enums.SharePlatform;
        sharedUrl: string | null;
        customMessage: string | null;
    })[]>;
}
//# sourceMappingURL=jobShare.service.d.ts.map