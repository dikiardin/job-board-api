export declare class UserProviderRepo {
    static findByProvider(provider: "GOOGLE", providerId: string): Promise<({
        user: {
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
        };
    } & {
        createdAt: Date;
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
        providers: {
            createdAt: Date;
            id: number;
            userId: number;
            provider: import("../../generated/prisma").$Enums.ProviderType;
            providerId: string;
            accessToken: string | null;
            refreshToken: string | null;
        }[];
    } & {
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
    static updateProfilePicture(userId: number, profilePicture: string): Promise<{
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
//# sourceMappingURL=userProvider.repository.d.ts.map