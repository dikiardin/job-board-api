export declare class CreateCompanyRepo {
    static createCompany(data: {
        name: string;
        email: string;
        description?: string;
        website?: string;
        locationCity?: string;
        locationProvince?: string;
        address?: string;
        logoUrl?: string;
        bannerUrl?: string;
        socials?: any;
        ownerAdminId: number;
    }): Promise<{
        email: string;
        name: string;
        phone: string | null;
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
    static findByAdminId(ownerAdminId: number): Promise<{
        email: string;
        name: string;
        phone: string | null;
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
}
//# sourceMappingURL=createCompany.repository.d.ts.map