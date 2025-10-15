export declare class BasicAuthService {
    static register(role: "USER" | "ADMIN", name: string, email: string, password: string): Promise<{
        message: string;
    }>;
    static verifyEmail(token: string): Promise<{
        message: string;
        token: string;
        user: {
            isProfileComplete: boolean;
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
        status?: never;
    } | {
        message: string;
        status: string;
        token?: never;
        user?: never;
    }>;
    static resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
    static login(email: string, password: string): Promise<{
        token: string;
        user: {
            isProfileComplete: boolean;
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
    }>;
}
//# sourceMappingURL=basicAuth.service.d.ts.map