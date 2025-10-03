export declare class EditProfileService {
    static editProfile(userId: number, role: "USER" | "ADMIN", data: any, file?: Express.Multer.File): Promise<{
        role: import("../../generated/prisma").$Enums.UserRole;
        name: string;
        email: string;
        passwordHash: string | null;
        phone: string | null;
        gender: string | null;
        dob: Date | null;
        education: string | null;
        address: string | null;
        profilePicture: string | null;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        city: string | null;
        id: number;
    } | {
        company: {
            name: string;
            email: string | null;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            city: string | null;
            id: string;
            location: string | null;
            description: string | null;
            website: string | null;
            logo: string | null;
            adminId: number | null;
        };
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
            profilePicture: string | null;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            city: string | null;
            id: number;
        };
    }>;
    static completeProfile(userId: number, data: any, file?: Express.Multer.File): Promise<{
        role: import("../../generated/prisma").$Enums.UserRole;
        name: string;
        email: string;
        passwordHash: string | null;
        phone: string | null;
        gender: string | null;
        dob: Date | null;
        education: string | null;
        address: string | null;
        profilePicture: string | null;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        city: string | null;
        id: number;
    } | {
        company: {
            name: string;
            email: string | null;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            city: string | null;
            id: string;
            location: string | null;
            description: string | null;
            website: string | null;
            logo: string | null;
            adminId: number | null;
        };
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
            profilePicture: string | null;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            city: string | null;
            id: number;
        };
    }>;
}
//# sourceMappingURL=editProfile.service.d.ts.map