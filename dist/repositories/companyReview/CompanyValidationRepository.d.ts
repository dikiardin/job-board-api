export declare class CompanyValidationRepository {
    static checkCompanyExists(companyId: number | string): Promise<boolean>;
    static getUserEmployment(userId: number, companyId: number | string): Promise<{
        id: number;
        startDate: Date | null;
        endDate: Date | null;
    } | null>;
    static getUserVerifiedEmployment(userId: number, companyId: number | string): Promise<{
        createdAt: Date;
        id: number;
        positionTitle: string | null;
        startDate: Date | null;
        endDate: Date | null;
        isCurrent: boolean;
        company: {
            name: string;
            id: number;
        } | null;
    } | null>;
}
//# sourceMappingURL=CompanyValidationRepository.d.ts.map