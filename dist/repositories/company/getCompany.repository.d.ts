interface GetAllCompaniesParams {
    page: number;
    limit: number;
    keyword?: string;
    city?: string;
}
export declare class GetCompanyRepository {
    static getAllCompanies({ page, limit, keyword, city }: GetAllCompaniesParams): Promise<{
        data: {
            name: string;
            email: string | null;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            city: string | null;
            id: number;
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
    static getCompanyById(companyId: string | number): Promise<{
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
        jobs: {
            city: string;
            id: number;
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
//# sourceMappingURL=getCompany.repository.d.ts.map