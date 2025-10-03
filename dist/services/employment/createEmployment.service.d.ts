export declare class CreateEmploymentService {
    static createForNewUser(userId: number): Promise<{
        createdAt: Date;
        id: number;
        startDate: Date | null;
        endDate: Date | null;
        userId: number;
        companyId: number | null;
    }>;
}
//# sourceMappingURL=createEmployment.service.d.ts.map