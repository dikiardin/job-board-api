export declare class CreateCompanyService {
    static createCompanyForAdmin(ownerAdminId: number, name: string, email: string, description?: string, website?: string, locationCity?: string, locationProvince?: string): Promise<{
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
}
//# sourceMappingURL=createCompany.service.d.ts.map