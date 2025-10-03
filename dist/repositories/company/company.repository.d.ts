export declare class CompanyRepo {
    static findByAdminId(adminId: number): Promise<{
        name: string;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        bannerUrl: string | null;
        website: string | null;
        locationCity: string | null;
        locationProvince: string | null;
        locationCountry: string | null;
        socials: import("../../generated/prisma/runtime/library").JsonValue | null;
        ownerAdminId: number | null;
    } | null>;
    static updateCompany(companyId: string | number, data: Partial<{
        email: string;
        name: string;
        location: string;
        description: string;
        website: string;
    }>): Promise<{
        name: string;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        bannerUrl: string | null;
        website: string | null;
        locationCity: string | null;
        locationProvince: string | null;
        locationCountry: string | null;
        socials: import("../../generated/prisma/runtime/library").JsonValue | null;
        ownerAdminId: number | null;
    }>;
}
//# sourceMappingURL=company.repository.d.ts.map