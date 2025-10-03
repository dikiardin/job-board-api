interface GetAllCompaniesParams {
    page: number;
    limit: number;
    keyword?: string;
    city?: string;
}
export declare class GetCompanyService {
    static getAllCompanies(params: GetAllCompaniesParams): Promise<{
        data: {
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
        }[];
        total: number;
    }>;
    static getCompanyById(companyId: string | number): Promise<{
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
}
export {};
//# sourceMappingURL=getCompany.service.d.ts.map