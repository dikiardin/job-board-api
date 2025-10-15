import { PrismaClient, Subscription, SubscriptionPlan } from "../../generated/prisma";
import { SeedUsersResult } from "./users";
interface SeedSubscriptionsOptions {
    prisma: PrismaClient;
    now: Date;
    addDays: (days: number) => Date;
    users: SeedUsersResult;
}
export interface SeedSubscriptionsResult {
    standardPlan: SubscriptionPlan;
    professionalPlan: SubscriptionPlan;
    ginaProfessional: Subscription;
    testProfessionalSubscription: Subscription;
    testStandardSubscription: Subscription;
}
export declare function seedSubscriptions({ prisma, now, addDays, users, }: SeedSubscriptionsOptions): Promise<SeedSubscriptionsResult>;
export {};
//# sourceMappingURL=subscriptions.d.ts.map