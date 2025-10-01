export declare class BasicAuthService {
    static register(role: "USER" | "ADMIN", name: string, email: string, password: string): Promise<{
        message: string;
    }>;
    static verifyEmail(token: string): Promise<{
        message: string;
        token: string;
        user: {
            role: import("../../generated/prisma").$Enums.UserRole;
            name: string;
            email: string;
            passwordHash: string | null;
            phone: string | null;
            gender: string | null;
            dob: Date | null;
            education: string | null;
            address: string | null;
            city: string | null;
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
            role: import("../../generated/prisma").$Enums.UserRole;
            name: string;
            email: string;
            passwordHash: string | null;
            phone: string | null;
            gender: string | null;
            dob: Date | null;
            education: string | null;
            address: string | null;
            city: string | null;
            profilePicture: string | null;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    }>;
}
//# sourceMappingURL=basicAuth.service.d.ts.map