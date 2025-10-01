export declare class GetCompanyRepository {
    static getAllCompanies(): Promise<{
        name: string;
        email: string | null;
        phone: string | null;
        city: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        _count: {
            jobs: number;
        };
        location: string | null;
        description: string | null;
        website: string | null;
        logo: string | null;
    }[]>;
    static getCompanyById(companyId: number): Promise<{
        name: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
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
//# sourceMappingURL=getCompany.repository.d.ts.map