export declare class PaymentManagementService {
    static createPaymentRecord(subscriptionId: number, planPrice: number): Promise<{
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
    static uploadPaymentProof(paymentId: number, proofUrl: string): Promise<{
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
    static approvePayment(id: number): Promise<{
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
    static rejectPayment(id: number): Promise<{
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
//# sourceMappingURL=paymentManagement.service.d.ts.map