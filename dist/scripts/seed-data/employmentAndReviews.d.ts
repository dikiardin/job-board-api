import { PrismaClient } from "../../generated/prisma";
import { SeedUsersResult } from "./users";
import { SeedCompaniesResult } from "./companies";
interface SeedEmploymentOptions {
    prisma: PrismaClient;
    now: Date;
    users: SeedUsersResult;
    companies: SeedCompaniesResult;
}
export declare function seedEmploymentAndReviews({ prisma, now, users, companies, }: SeedEmploymentOptions): Promise<void>;
export {};
//# sourceMappingURL=employmentAndReviews.d.ts.map