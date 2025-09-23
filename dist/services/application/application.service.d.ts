import { UserRole } from "../../generated/prisma";
export declare class ApplicationService {
    static createApplication(params: {
        requesterId: number;
        requesterRole: UserRole;
        jobId: number;
        cvFile: string;
        expectedSalary?: number;
    }): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        status: import("../../generated/prisma").$Enums.ApplicationStatus;
        jobId: number;
        cvFile: string;
        expectedSalary: number | null;
        reviewNote: string | null;
    }>;
}
//# sourceMappingURL=application.service.d.ts.map