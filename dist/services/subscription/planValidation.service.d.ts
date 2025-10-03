export declare class PlanValidationService {
    static validatePlanExists(id: number): Promise<{
        id: number;
        planName: string;
        planPrice: import("../../generated/prisma/runtime/library").Decimal;
        planDescription: string | null;
    }>;
    static validatePlanNameUnique(planName: string, excludeId?: number): Promise<void>;
    static validatePlanNotInUse(id: number): Promise<void>;
}
//# sourceMappingURL=planValidation.service.d.ts.map