interface GetAllCompaniesParams {
    page: number;
    limit: number;
    keyword?: string;
    city?: string;
}
type SortField = "name" | "jobsCount";
type SortOrder = "asc" | "desc";
export declare class GetCompanyService {
    static getAllCompanies(params: GetAllCompaniesParams & {
        sort?: SortField;
        order?: SortOrder;
    }): Promise<{
        data: {
            jobsCount: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            _count: {
                jobs: number;
            };
            slug: string;
            description: string | null;
            logoUrl: string | null;
            bannerUrl: string | null;
            website: string | null;
            locationCity: string | null;
            locationProvince: string | null;
            jobs: {
                id: number;
            }[];
        }[];
        total: number;
    }>;
    static getCompanyBySlug(slug: string): Promise<{
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
        jobs: {
            city: string;
            id: number;
            slug: string;
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