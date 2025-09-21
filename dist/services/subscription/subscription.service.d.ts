export declare class SubscriptionService {
    static getAllSubscriptions(): Promise<({
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
    } & {
        createdAt: Date;
        id: number;
        userId: number;
        subscriptionPlanId: number;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    })[]>;
    static getSubscriptionById(id: number): Promise<{
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
    } & {
        createdAt: Date;
        id: number;
        userId: number;
        subscriptionPlanId: number;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    }>;
    static getUserSubscriptions(userId: number): Promise<({
        plan: {
            id: number;
            planName: string;
            planPrice: import("../../generated/prisma/runtime/library").Decimal;
            planDescription: string | null;
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
    } & {
        createdAt: Date;
        id: number;
        userId: number;
        subscriptionPlanId: number;
        startDate: Date;
        endDate: Date;
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
        userId: number;
        subscriptionPlanId: number;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    }) | null>;
    static subscribeUser(userId: number, planId: number): Promise<{
        subscription: {
            plan: {
                id: number;
                planName: string;
                planPrice: import("../../generated/prisma/runtime/library").Decimal;
                planDescription: string | null;
            };
        } & {
            createdAt: Date;
            id: number;
            userId: number;
            subscriptionPlanId: number;
            startDate: Date;
            endDate: Date;
            isActive: boolean;
        };
        payment: {
            subscription: {
                plan: {
                    id: number;
                    planName: string;
                    planPrice: import("../../generated/prisma/runtime/library").Decimal;
                    planDescription: string | null;
                };
            } & {
                createdAt: Date;
                id: number;
                userId: number;
                subscriptionPlanId: number;
                startDate: Date;
                endDate: Date;
                isActive: boolean;
            };
        } & {
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
        };
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
        userId: number;
        subscriptionPlanId: number;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    }>;
}
//# sourceMappingURL=subscription.service.d.ts.map