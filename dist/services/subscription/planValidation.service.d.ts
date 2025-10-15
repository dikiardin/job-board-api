export declare class PlanValidationService {
    static validatePlanExists(id: number): Promise<{
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
    static validatePlanNameUnique(planName: string, excludeId?: number): Promise<void>;
    static validatePlanNotInUse(id: number): Promise<void>;
}
//# sourceMappingURL=planValidation.service.d.ts.map