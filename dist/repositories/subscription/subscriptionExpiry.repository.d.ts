export declare class SubscriptionExpiryRepo {
    static getSubscriptionsExpiringTomorrow(): Promise<({
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
    })[]>;
    static getSubscriptionsExpiringInMinutes(minutes: number): Promise<({
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
    })[]>;
    static getExpiredSubscriptions(): Promise<({
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
    })[]>;
}
//# sourceMappingURL=subscriptionExpiry.repository.d.ts.map