import { PrismaClient, User } from "../../generated/prisma";
import { adminSeeds, seekerSeeds } from "./userSeedData";
interface SeedUsersOptions {
    prisma: PrismaClient;
    now: Date;
    passwords: {
        admin: string;
        user: string;
        developer: string;
        mentor: string;
    };
}
type AdminKey = typeof adminSeeds[number]["key"];
type SeekerKey = typeof seekerSeeds[number]["key"];
type AdminRecord = Record<AdminKey, User>;
type SeekerRecord = Record<SeekerKey, User>;
export interface SeedUsersResult {
    developer: User;
    mentor: User;
    admins: AdminRecord;
    seekers: SeekerRecord;
}
export declare function seedUsers({ prisma, now, passwords, }: SeedUsersOptions): Promise<SeedUsersResult>;
export {};
//# sourceMappingURL=users.d.ts.map