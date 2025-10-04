export declare class SubscriptionService {
    static getAllSubscriptions(): Promise<({
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
        payments: {
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
        }[];
        usage: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            subscriptionId: number;
            assessmentsUsed: number;
            cvGenerated: number;
            priorityReviews: number;
            periodStart: Date;
            periodEnd: Date;
        } | null;
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
    })[]>;
    static getSubscriptionById(id: number): Promise<{
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
        payments: {
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
        }[];
        usage: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            subscriptionId: number;
            assessmentsUsed: number;
            cvGenerated: number;
            priorityReviews: number;
            periodStart: Date;
            periodEnd: Date;
        } | null;
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
    }>;
    static getUserSubscriptions(userId: number): Promise<({
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
        payments: {
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
        }[];
        usage: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            subscriptionId: number;
            assessmentsUsed: number;
            cvGenerated: number;
            priorityReviews: number;
            periodStart: Date;
            periodEnd: Date;
        } | null;
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
    })[]>;
    static getUserActiveSubscription(userId: number): Promise<({
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
        usage: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            subscriptionId: number;
            assessmentsUsed: number;
            cvGenerated: number;
            priorityReviews: number;
            periodStart: Date;
            periodEnd: Date;
        } | null;
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
    }) | null>;
    static subscribeUser(userId: number, planId: number): Promise<{
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
        payment: {
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
        };
    }>;
    static updateSubscription(id: number, data: {
        status?: any;
        startDate?: Date;
        expiresAt?: Date;
        paidAt?: Date;
        approvedByDeveloperId?: number;
    }): Promise<{
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
        usage: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            subscriptionId: number;
            assessmentsUsed: number;
            cvGenerated: number;
            priorityReviews: number;
            periodStart: Date;
            periodEnd: Date;
        } | null;
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
    }>;
}
//# sourceMappingURL=subscription.service.d.ts.map