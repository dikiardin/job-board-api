export declare class RenewalValidationService {
    static validatePlan(planId: number): Promise<{
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
    static validateRenewalEligibility(subscription: any): void;
}
//# sourceMappingURL=renewalValidation.service.d.ts.map