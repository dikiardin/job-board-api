export declare class PaymentMutationRepo {
    static createPayment(data: {
        subscriptionId: number;
        paymentMethod: "TRANSFER" | "GATEWAY";
        amount: number;
        paymentProof?: string;
        expiresAt?: Date;
    }): Promise<{
        subscription: {
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
            status: import("../../generated/prisma").$Enums.SubscriptionStatus;
            planId: number;
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
        slug: string;
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
        slug: string;
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
    static uploadPaymentProofBySlug(slug: string, paymentProof: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        slug: string;
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
    static updatePaymentStatus(paymentId: number, status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED", approvedAt?: Date): Promise<{
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
            status: import("../../generated/prisma").$Enums.SubscriptionStatus;
            planId: number;
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
        slug: string;
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
    static updatePaymentStatusBySlug(slug: string, status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED", approvedAt?: Date): Promise<{
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
            status: import("../../generated/prisma").$Enums.SubscriptionStatus;
            planId: number;
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
        slug: string;
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
}
//# sourceMappingURL=paymentMutation.repository.d.ts.map