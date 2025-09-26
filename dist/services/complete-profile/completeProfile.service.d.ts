export declare class CompleteProfileService {
    static completeProfile(userId: number, role: "USER" | "ADMIN", data: any, file?: Express.Multer.File): Promise<{
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
    } | {
        name: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        location: string | null;
        description: string | null;
        website: string | null;
        logo: string | null;
        adminId: number | null;
    }>;
}
//# sourceMappingURL=completeProfile.service.d.ts.map