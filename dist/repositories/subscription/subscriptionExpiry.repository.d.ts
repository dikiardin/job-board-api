export declare class SubscriptionExpiryRepo {
    static getSubscriptionsExpiringTomorrow(): Promise<({
        user: {
            name: string;
            email: string;
            id: number;
        };
        plan: {
            id: number;
            planName: string;
            planPrice: import("../../generated/prisma/runtime/library").Decimal;
            planDescription: string | null;
        };
    } & {
        createdAt: Date;
        id: number;
        startDate: Date;
        endDate: Date;
        userId: number;
        subscriptionPlanId: number;
        isActive: boolean;
    })[]>;
    static getSubscriptionsExpiringInMinutes(minutes: number): Promise<({
        user: {
            name: string;
            email: string;
            id: number;
        };
        plan: {
            id: number;
            planName: string;
            planPrice: import("../../generated/prisma/runtime/library").Decimal;
            planDescription: string | null;
        };
    } & {
        createdAt: Date;
        id: number;
        startDate: Date;
        endDate: Date;
        userId: number;
        subscriptionPlanId: number;
        isActive: boolean;
    })[]>;
    static getExpiredSubscriptions(): Promise<({
        user: {
            name: string;
            email: string;
            id: number;
        };
        plan: {
            id: number;
            planName: string;
            planPrice: import("../../generated/prisma/runtime/library").Decimal;
            planDescription: string | null;
        };
    } & {
        createdAt: Date;
        id: number;
        startDate: Date;
        endDate: Date;
        userId: number;
        subscriptionPlanId: number;
        isActive: boolean;
    })[]>;
}
//# sourceMappingURL=subscriptionExpiry.repository.d.ts.map