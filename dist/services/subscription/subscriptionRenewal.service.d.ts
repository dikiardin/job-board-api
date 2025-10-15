export declare class SubscriptionRenewalService {
    static renewSubscription(userId: number, planId?: number): Promise<{
        subscription: any;
        payment: any;
        plan: any;
        message: string;
    }>;
    static getRenewalInfo(userId: number): Promise<{
        currentSubscription: any;
        plan: any;
        canRenew: boolean;
        renewalPrice: any;
        pendingPayment: any;
    } | {
        currentSubscription: null;
        plan: null;
        canRenew: boolean;
        renewalPrice: number;
        message: string;
    }>;
    private static getCurrentSubscription;
    private static getRecentExpiredSubscription;
    private static createRenewalSubscription;
    private static getPendingRenewalPayment;
    private static buildRenewalResponse;
    private static buildRenewalInfoResponse;
    private static buildErrorResponse;
}
//# sourceMappingURL=subscriptionRenewal.service.d.ts.map