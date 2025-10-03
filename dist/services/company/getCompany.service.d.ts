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
            email: string | null;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            city: string | null;
            id: string;
            _count: {
                jobs: number;
            };
            location: string | null;
            description: string | null;
            website: string | null;
            logo: string | null;
        }[];
        total: number;
    }>;
    static getCompanyById(companyId: string): Promise<{
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
        jobs: {
            city: string;
            id: string;
            title: string;
            category: string;
            salaryMin: number | null;
            salaryMax: number | null;
            tags: string[];
            banner: string | null;
            deadline: Date | null;
        }[];
    } | null>;
}
export {};
//# sourceMappingURL=getCompany.service.d.ts.map