import { PrismaClient } from "../../generated/prisma";
import { SeedUsersResult } from "./users";
import { SeedCompaniesResult } from "./companies";
import { SeedSubscriptionsResult } from "./subscriptions";
import { SeedAssessmentsResult } from "./assessments";
interface SeedSocialOptions {
    prisma: PrismaClient;
    users: SeedUsersResult;
    companies: SeedCompaniesResult;
    subscriptions: SeedSubscriptionsResult;
    assessments: SeedAssessmentsResult;
}
export declare function seedSocialAndAnalytics({ prisma, users, companies, subscriptions, assessments, }: SeedSocialOptions): Promise<void>;
export {};
//# sourceMappingURL=socialAndAnalytics.d.ts.map