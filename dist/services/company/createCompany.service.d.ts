export declare class CreateCompanyService {
    static createCompanyForAdmin(adminId: number, name: string, email: string): Promise<{
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
//# sourceMappingURL=createCompany.service.d.ts.map