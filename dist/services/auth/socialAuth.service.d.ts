export declare class SocialAuthService {
    static socialLogin(provider: "GOOGLE", token: string, role: "ADMIN" | "USER"): Promise<{
        token: string;
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
}
//# sourceMappingURL=socialAuth.service.d.ts.map