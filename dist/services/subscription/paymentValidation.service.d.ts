export declare class PaymentValidationService {
    static validatePaymentExists(id: number): Promise<{
        subscription: {
            user: {
                name: string;
                email: string;
                id: number;
            };
            plan: {
                id: number;
                planName: string;
                planPrice: import("../../generated/prisma/runtime/library").Decimal;
                planDescription: string | null;
            };
        } & {
            createdAt: Date;
            id: number;
            startDate: Date;
            endDate: Date;
            userId: number;
            subscriptionPlanId: number;
            isActive: boolean;
        };
    } & {
        createdAt: Date;
        id: number;
        subscriptionId: number;
        paymentMethod: import("../../generated/prisma").$Enums.PaymentMethod;
        paymentProof: string | null;
        status: import("../../generated/prisma").$Enums.PaymentStatus;
        amount: import("../../generated/prisma/runtime/library").Decimal;
        approvedAt: Date | null;
        gatewayTransactionId: string | null;
        expiredAt: Date | null;
    }>;
    static validatePaymentStatus(payment: any, expectedStatus?: string): void;
}
//# sourceMappingURL=paymentValidation.service.d.ts.map