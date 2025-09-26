export declare class CompleteProfileRepository {
    static updateUserProfile(userId: number, data: any): Promise<{
        role: import("../../generated/prisma").$Enums.UserRole;
        name: string;
        email: string;
        passwordHash: string;
        phone: string | null;
        gender: string | null;
        dob: Date | null;
        education: string | null;
        address: string | null;
        profilePicture: string | null;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    static updateCompanyProfile(adminId: number, data: any): Promise<{
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
        adminId: number | null;
    }>;
    static findUserById(userId: number): Promise<{
        role: import("../../generated/prisma").$Enums.UserRole;
        name: string;
        email: string;
        passwordHash: string;
        phone: string | null;
        gender: string | null;
        dob: Date | null;
        education: string | null;
        address: string | null;
        profilePicture: string | null;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    } | null>;
}
//# sourceMappingURL=completeProfile.repository.d.ts.map