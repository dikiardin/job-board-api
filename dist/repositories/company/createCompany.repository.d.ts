export declare class CreateCompanyRepo {
    static createCompany(data: {
        name: string;
        email?: string;
        phone?: string;
        location?: string;
        description?: string;
        website?: string;
        logo?: string;
        adminId: number;
    }): Promise<{
        name: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        city: string | null;
        id: number;
        location: string | null;
        description: string | null;
        website: string | null;
        logo: string | null;
        adminId: number | null;
    }>;
    static findByAdminId(adminId: number): Promise<{
        name: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        city: string | null;
        id: number;
        location: string | null;
        description: string | null;
        website: string | null;
        logo: string | null;
        adminId: number | null;
    } | null>;
}
//# sourceMappingURL=createCompany.repository.d.ts.map