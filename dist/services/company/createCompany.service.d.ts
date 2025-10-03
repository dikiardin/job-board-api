export declare class CreateCompanyService {
    static createCompanyForAdmin(adminId: number, name: string, email: string): Promise<{
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
        adminId: number | null;
    }>;
}
//# sourceMappingURL=createCompany.service.d.ts.map