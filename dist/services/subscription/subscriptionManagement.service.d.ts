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
    })[]>;
    static getUserActiveSubscription(userId: number): Promise<{
        isActive: boolean;
        subscription: null;
        message: string;
        plan?: never;
        expiresAt?: never;
        status?: never;
    } | {
        isActive: boolean;
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
        expiresAt: Date | null;
        status: import("../../generated/prisma").$Enums.SubscriptionStatus;
        message?: never;
    }>;
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
        status: import("../../generated/prisma").$Enums.SubscriptionStatus;
        planId: number;
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
    }>;
}
//# sourceMappingURL=subscriptionManagement.service.d.ts.map