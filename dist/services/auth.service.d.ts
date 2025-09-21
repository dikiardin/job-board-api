export declare class AuthService {
    static register(role: "USER" | "ADMIN", name: string, email: string, password: string, phone?: string): Promise<{
        message: string;
    }>;
    static verifyEmail(token: string): Promise<{
        message: string;
        user: {
            role: import("../generated/prisma").$Enums.UserRole;
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
    }>;
    static login(email: string, password: string): Promise<{
        token: string;
        user: {
            role: import("../generated/prisma").$Enums.UserRole;
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
    }>;
    static keepLogin(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        role: import("../generated/prisma").$Enums.UserRole;
        isVerified: boolean;
        token: string;
    }>;
    static socialLogin(provider: "GOOGLE" | "APPLE" | "MICROSOFT", token: string): Promise<{
        token: string;
        role: import("../generated/prisma").$Enums.UserRole;
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
//# sourceMappingURL=auth.service.d.ts.map