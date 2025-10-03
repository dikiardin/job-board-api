export declare class ProfileService {
    static getUserProfile(userId: number): Promise<{
        role: import("../../generated/prisma").$Enums.UserRole;
        email: string;
        passwordHash: string | null;
        name: string | null;
        phone: string | null;
        gender: string | null;
        dob: Date | null;
        education: string | null;
        address: string | null;
        city: string | null;
        profilePicture: string | null;
        emailVerifiedAt: Date | null;
        verificationToken: string | null;
        verificationTokenExpiresAt: Date | null;
        passwordResetToken: string | null;
        passwordResetExpiresAt: Date | null;
        emailChangeToken: string | null;
        emailChangeNewEmail: string | null;
        emailChangeExpiresAt: Date | null;
        lastLoginAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    static getCompanyProfile(adminId: number): Promise<{
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
//# sourceMappingURL=profile.service.d.ts.map