export declare class SubscriptionRepo {
    static getAllSubscriptions(): Promise<({
        user: {
            name: string;
            email: string;
            id: number;
        };
        payments: {
            createdAt: Date;
            id: number;
            subscriptionId: number;
            paymentMethod: import("../../generated/prisma").$Enums.PaymentMethod;
            paymentProof: string | null;
            status: import("../../generated/prisma").$Enums.PaymentStatus;
            amount: import("../../generated/prisma/runtime/library").Decimal;
            approvedAt: Date | null;
            gatewayTransactionId: string | null;
            expiredAt: Date | null;
        }[];
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
    static getSubscriptionById(id: number): Promise<({
        user: {
            name: string;
            email: string;
            id: number;
        };
        payments: {
            createdAt: Date;
            id: number;
            subscriptionId: number;
            paymentMethod: import("../../generated/prisma").$Enums.PaymentMethod;
            paymentProof: string | null;
            status: import("../../generated/prisma").$Enums.PaymentStatus;
            amount: import("../../generated/prisma/runtime/library").Decimal;
            approvedAt: Date | null;
            gatewayTransactionId: string | null;
            expiredAt: Date | null;
        }[];
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
    }) | null>;
    static getUserSubscriptions(userId: number): Promise<({
        payments: {
            createdAt: Date;
            id: number;
            subscriptionId: number;
            paymentMethod: import("../../generated/prisma").$Enums.PaymentMethod;
            paymentProof: string | null;
            status: import("../../generated/prisma").$Enums.PaymentStatus;
            amount: import("../../generated/prisma/runtime/library").Decimal;
            approvedAt: Date | null;
            gatewayTransactionId: string | null;
            expiredAt: Date | null;
        }[];
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
    static getUserActiveSubscription(userId: number): Promise<({
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
    }) | null>;
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
//# sourceMappingURL=subscription.repository.d.ts.map