export declare class EligibilityService {
    static checkUserEligibility(userId: number, companyId: string): Promise<{
        isEligible: boolean;
        canReview: boolean;
        hasExistingReview: boolean;
        message: string;
    }>;
    private static buildNotFoundResponse;
    private static buildNoEmploymentResponse;
    private static buildExistingReviewResponse;
    private static buildEligibleResponse;
}
//# sourceMappingURL=EligibilityService.d.ts.map