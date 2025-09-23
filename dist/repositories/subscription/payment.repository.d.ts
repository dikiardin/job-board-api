export declare class PaymentRepo {
    static getPendingPayments(): Promise<({
        subscription: {
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
    })[]>;
    static getPaymentById(id: number): Promise<({
        subscription: {
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
    }) | null>;
    static createPayment(data: {
        subscriptionId: number;
        paymentMethod: "TRANSFER" | "GATEWAY";
        amount: number;
        paymentProof?: string;
        expiredAt?: Date;
    }): Promise<{
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
            startDate: Date;
            endDate: Date;
            userId: number;
            subscriptionPlanId: number;
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
    }>;
    static uploadPaymentProof(paymentId: number, paymentProof: string): Promise<{
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
    }>;
    static updatePaymentStatus(paymentId: number, status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED", approvedAt?: Date): Promise<{
        subscription: {
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
    }>;
    static getPaymentsBySubscriptionId(subscriptionId: number): Promise<{
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
    }[]>;
}
//# sourceMappingURL=payment.repository.d.ts.map