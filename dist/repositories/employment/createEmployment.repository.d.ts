export declare class CreateEmploymentRepo {
    static createEmploymentForUser(userId: number): Promise<{
        createdAt: Date;
        id: number;
        startDate: Date | null;
        endDate: Date | null;
        userId: number;
        companyId: number | null;
    }>;
}
//# sourceMappingURL=createEmployment.repository.d.ts.map