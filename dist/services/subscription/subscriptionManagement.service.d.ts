export declare class SubscriptionManagementService {
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
    static validatePlanExists(planId: number): Promise<{
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
    }>;
    static checkActiveSubscription(userId: number): Promise<void>;
    static createSubscription(userId: number, planId: number): Promise<{
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
//# sourceMappingURL=subscriptionManagement.service.d.ts.map