export declare class PaymentService {
    static getPendingPayments(): Promise<({
        subscription: {
            user: {
                email: string;
                name: string | null;
                id: number;
            };
            plan: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                description: string | null;
                code: import("../../generated/prisma").$Enums.SubscriptionPlanCode;
                priceIdr: number;
                perks: string[];
                monthlyAssessmentQuota: number | null;
                priorityCvReview: boolean;
                cvGeneratorEnabled: boolean;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            startDate: Date | null;
            userId: number;
            planId: number;
            status: import("../../generated/prisma").$Enums.SubscriptionStatus;
            paidAt: Date | null;
            expiresAt: Date | null;
            cancelledAt: Date | null;
            paymentMethod: import("../../generated/prisma").$Enums.PaymentMethod;
            proofUrl: string | null;
            approvedByDeveloperId: number | null;
            lastReminderSentAt: Date | null;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        status: import("../../generated/prisma").$Enums.PaymentStatus;
        paidAt: Date | null;
        expiresAt: Date | null;
        paymentMethod: import("../../generated/prisma").$Enums.PaymentMethod;
        subscriptionId: number;
        amount: import("../../generated/prisma/runtime/library").Decimal;
        paymentProof: string | null;
        approvedAt: Date | null;
        approvedById: number | null;
        gatewayTransactionId: string | null;
        referenceCode: string | null;
        notes: string | null;
    })[]>;
    static getPaymentById(id: number): Promise<{
        subscription: {
            user: {
                email: string;
                name: string | null;
                id: number;
            };
            plan: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                description: string | null;
                code: import("../../generated/prisma").$Enums.SubscriptionPlanCode;
                priceIdr: number;
                perks: string[];
                monthlyAssessmentQuota: number | null;
                priorityCvReview: boolean;
                cvGeneratorEnabled: boolean;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            startDate: Date | null;
            userId: number;
            planId: number;
            status: import("../../generated/prisma").$Enums.SubscriptionStatus;
            paidAt: Date | null;
            expiresAt: Date | null;
            cancelledAt: Date | null;
            paymentMethod: import("../../generated/prisma").$Enums.PaymentMethod;
            proofUrl: string | null;
            approvedByDeveloperId: number | null;
            lastReminderSentAt: Date | null;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        status: import("../../generated/prisma").$Enums.PaymentStatus;
        paidAt: Date | null;
        expiresAt: Date | null;
        paymentMethod: import("../../generated/prisma").$Enums.PaymentMethod;
        subscriptionId: number;
        amount: import("../../generated/prisma/runtime/library").Decimal;
        paymentProof: string | null;
        approvedAt: Date | null;
        approvedById: number | null;
        gatewayTransactionId: string | null;
        referenceCode: string | null;
        notes: string | null;
    }>;
    static uploadPaymentProof(paymentId: number, paymentProof: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        status: import("../../generated/prisma").$Enums.PaymentStatus;
        paidAt: Date | null;
        expiresAt: Date | null;
        paymentMethod: import("../../generated/prisma").$Enums.PaymentMethod;
        subscriptionId: number;
        amount: import("../../generated/prisma/runtime/library").Decimal;
        paymentProof: string | null;
        approvedAt: Date | null;
        approvedById: number | null;
        gatewayTransactionId: string | null;
        referenceCode: string | null;
        notes: string | null;
    }>;
    static approvePayment(paymentId: number): Promise<{
        subscription: {
            user: {
                email: string;
                name: string | null;
                id: number;
            };
            plan: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                description: string | null;
                code: import("../../generated/prisma").$Enums.SubscriptionPlanCode;
                priceIdr: number;
                perks: string[];
                monthlyAssessmentQuota: number | null;
                priorityCvReview: boolean;
                cvGeneratorEnabled: boolean;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            startDate: Date | null;
            userId: number;
            planId: number;
            status: import("../../generated/prisma").$Enums.SubscriptionStatus;
            paidAt: Date | null;
            expiresAt: Date | null;
            cancelledAt: Date | null;
            paymentMethod: import("../../generated/prisma").$Enums.PaymentMethod;
            proofUrl: string | null;
            approvedByDeveloperId: number | null;
            lastReminderSentAt: Date | null;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        status: import("../../generated/prisma").$Enums.PaymentStatus;
        paidAt: Date | null;
        expiresAt: Date | null;
        paymentMethod: import("../../generated/prisma").$Enums.PaymentMethod;
        subscriptionId: number;
        amount: import("../../generated/prisma/runtime/library").Decimal;
        paymentProof: string | null;
        approvedAt: Date | null;
        approvedById: number | null;
        gatewayTransactionId: string | null;
        referenceCode: string | null;
        notes: string | null;
    }>;
    static rejectPayment(paymentId: number): Promise<{
        subscription: {
            user: {
                email: string;
                name: string | null;
                id: number;
            };
            plan: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                description: string | null;
                code: import("../../generated/prisma").$Enums.SubscriptionPlanCode;
                priceIdr: number;
                perks: string[];
                monthlyAssessmentQuota: number | null;
                priorityCvReview: boolean;
                cvGeneratorEnabled: boolean;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            startDate: Date | null;
            userId: number;
            planId: number;
            status: import("../../generated/prisma").$Enums.SubscriptionStatus;
            paidAt: Date | null;
            expiresAt: Date | null;
            cancelledAt: Date | null;
            paymentMethod: import("../../generated/prisma").$Enums.PaymentMethod;
            proofUrl: string | null;
            approvedByDeveloperId: number | null;
            lastReminderSentAt: Date | null;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        status: import("../../generated/prisma").$Enums.PaymentStatus;
        paidAt: Date | null;
        expiresAt: Date | null;
        paymentMethod: import("../../generated/prisma").$Enums.PaymentMethod;
        subscriptionId: number;
        amount: import("../../generated/prisma/runtime/library").Decimal;
        paymentProof: string | null;
        approvedAt: Date | null;
        approvedById: number | null;
        gatewayTransactionId: string | null;
        referenceCode: string | null;
        notes: string | null;
    }>;
    static getPaymentsBySubscriptionId(subscriptionId: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        status: import("../../generated/prisma").$Enums.PaymentStatus;
        paidAt: Date | null;
        expiresAt: Date | null;
        paymentMethod: import("../../generated/prisma").$Enums.PaymentMethod;
        subscriptionId: number;
        amount: import("../../generated/prisma/runtime/library").Decimal;
        paymentProof: string | null;
        approvedAt: Date | null;
        approvedById: number | null;
        gatewayTransactionId: string | null;
        referenceCode: string | null;
        notes: string | null;
    }[]>;
}
//# sourceMappingURL=payment.service.d.ts.map