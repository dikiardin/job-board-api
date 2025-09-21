export declare class PlanService {
    static getAllPlans(): Promise<{
        id: number;
        planName: string;
        planPrice: import("../../generated/prisma/runtime/library").Decimal;
        planDescription: string | null;
    }[]>;
    static getPlanById(id: number): Promise<{
        id: number;
        planName: string;
        planPrice: import("../../generated/prisma/runtime/library").Decimal;
        planDescription: string | null;
    }>;
    static createPlan(data: {
        planName: string;
        planPrice: number;
        planDescription: string;
    }): Promise<{
        id: number;
        planName: string;
        planPrice: import("../../generated/prisma/runtime/library").Decimal;
        planDescription: string | null;
    }>;
    static updatePlan(id: number, data: {
        planName?: string;
        planPrice?: number;
        planDescription?: string;
    }): Promise<{
        id: number;
        planName: string;
        planPrice: import("../../generated/prisma/runtime/library").Decimal;
        planDescription: string | null;
    }>;
    static deletePlan(id: number): Promise<{
        id: number;
        planName: string;
        planPrice: import("../../generated/prisma/runtime/library").Decimal;
        planDescription: string | null;
    }>;
}
//# sourceMappingURL=plan.service.d.ts.map