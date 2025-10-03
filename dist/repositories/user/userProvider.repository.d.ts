export declare class UserProviderRepo {
    static findByProvider(provider: "GOOGLE", providerId: string): Promise<({
        user: {
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
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        provider: import("../../generated/prisma").$Enums.ProviderType;
        providerId: string;
        accessToken: string | null;
        refreshToken: string | null;
    }) | null>;
    static createUserWithProvider(data: {
        name: string;
        email: string;
        provider: "GOOGLE";
        providerId: string;
        role: "USER" | "ADMIN";
        profilePicture?: string | null;
    }): Promise<{
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
    static updateProfilePicture(userId: number, profilePicture: string): Promise<{
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
}
//# sourceMappingURL=userProvider.repository.d.ts.map