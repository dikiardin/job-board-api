export declare class UserRepo {
    static createUser(data: {
        name: string;
        email: string;
        passwordHash: string;
        role: "USER" | "ADMIN";
        phone?: string;
    }): Promise<{
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
    static findByEmail(email: string): Promise<{
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
    } | null>;
    static findById(id: number): Promise<{
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
    } | null>;
    static verifyUser(id: number): Promise<{
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
//# sourceMappingURL=user.repository.d.ts.map