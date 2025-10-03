export declare class PlanRepo {
    static getAllPlans(): Promise<{
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
    }[]>;
    static getPlanById(id: number): Promise<{
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
    } | null>;
    static createPlan(data: {
        planName: string;
        planPrice: number;
        planDescription: string;
    }): Promise<{
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
    static updatePlan(id: number, data: {
        planName?: string;
        planPrice?: number;
        planDescription?: string;
    }): Promise<{
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
    static deletePlan(id: number): Promise<{
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
    static getAllSubscriptions(): Promise<{
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
    }[]>;
}
//# sourceMappingURL=plan.repository.d.ts.map