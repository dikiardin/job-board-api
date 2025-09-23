export declare class KeepLoginService {
    static keepLogin(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        role: import("../../generated/prisma").$Enums.UserRole;
        isVerified: boolean;
        token: string;
    }>;
}
//# sourceMappingURL=keepLogin.service.d.ts.map