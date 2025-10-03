export declare class SocialAuthService {
    static socialLogin(provider: "GOOGLE", token: string, role: "ADMIN" | "USER"): Promise<{
        token: string;
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
//# sourceMappingURL=socialAuth.service.d.ts.map