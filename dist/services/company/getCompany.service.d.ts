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
            createdAt: Date;
            updatedAt: Date;
            id: number;
            _count: {
                jobs: number;
            };
            description: string | null;
            logoUrl: string | null;
            bannerUrl: string | null;
            website: string | null;
            locationCity: string | null;
            locationProvince: string | null;
        }[];
        total: number;
    }>;
    static getCompanyById(companyId: string | number): Promise<{
        email: string;
        name: string;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        logoUrl: string | null;
        bannerUrl: string | null;
        website: string | null;
        locationCity: string | null;
        locationProvince: string | null;
        jobs: {
            city: string;
            id: number;
            bannerUrl: string | null;
            title: string;
            category: string;
            salaryMin: number | null;
            salaryMax: number | null;
            tags: string[];
            applyDeadline: Date | null;
        }[];
    } | null>;
}
export {};
//# sourceMappingURL=getCompany.service.d.ts.map