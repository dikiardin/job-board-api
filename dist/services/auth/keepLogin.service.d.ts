export declare class KeepLoginService {
    static keepLogin(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        role: import("../../generated/prisma").$Enums.UserRole;
        isVerified: boolean;
        token: string;
        profilePicture: string | null;
    }>;
}
//# sourceMappingURL=keepLogin.service.d.ts.map