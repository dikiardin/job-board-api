import { PrismaClient } from "../../generated/prisma";
import { SeedUsersResult } from "./users";
import { SeedAssessmentsResult } from "./assessments";
interface SeedBadgesOptions {
    prisma: PrismaClient;
    now: Date;
    users: SeedUsersResult;
    assessments: SeedAssessmentsResult;
}
export declare function seedBadgesAndCvs({ prisma, now, users, assessments, }: SeedBadgesOptions): Promise<void>;
export {};
//# sourceMappingURL=badgesAndCvs.d.ts.map