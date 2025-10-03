export declare class SubscriptionMutationRepo {
    static createSubscription(data: {
        userId: number;
        subscriptionPlanId: number;
        startDate: Date;
        endDate: Date;
    }): Promise<{
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
    }>;
    static updateSubscription(id: number, data: {
        isActive?: boolean;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
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
    }>;
}
//# sourceMappingURL=subscriptionMutation.repository.d.ts.map