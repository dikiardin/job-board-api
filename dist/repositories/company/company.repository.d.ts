export declare class CompanyRepo {
    static findByAdminId(adminId: number): Promise<{
        name: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        city: string | null;
        id: string;
        location: string | null;
        description: string | null;
        website: string | null;
        logo: string | null;
        adminId: number | null;
    } | null>;
    static updateCompany(companyId: string, data: Partial<{
        email: string;
        name: string;
        location: string;
        description: string;
        website: string;
    }>): Promise<{
        name: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        city: string | null;
        id: string;
        location: string | null;
        description: string | null;
        website: string | null;
        logo: string | null;
        adminId: number | null;
    }>;
}
//# sourceMappingURL=company.repository.d.ts.map