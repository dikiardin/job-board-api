export declare class CreateEmploymentService {
    static createForNewUser(userId: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        positionTitle: string | null;
        department: string | null;
        startDate: Date | null;
        endDate: Date | null;
        isCurrent: boolean;
        isVerified: boolean;
        verifiedAt: Date | null;
        companyNameSnapshot: string | null;
        userNameSnapshot: string | null;
        userId: number;
        companyId: number | null;
        verifiedById: number | null;
    }>;
}
//# sourceMappingURL=createEmployment.service.d.ts.map