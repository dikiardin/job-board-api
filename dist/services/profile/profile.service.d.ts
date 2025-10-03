export declare class ProfileService {
    static getUserProfile(userId: number): Promise<{
        role: import("../../generated/prisma").$Enums.UserRole;
        name: string;
        email: string;
        phone: string | null;
        gender: string | null;
        dob: Date | null;
        education: string | null;
        address: string | null;
        profilePicture: string | null;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        city: string | null;
        id: number;
    }>;
    static getCompanyProfile(adminId: number): Promise<{
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
//# sourceMappingURL=profile.service.d.ts.map