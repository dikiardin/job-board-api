export declare class ReviewStatsQueryRepository {
    static getCompanyReviewStats(companyId: number | string): Promise<{
        totalReviews: number;
        averageRatings: {
            culture: number;
            facilities: number;
            workLife: number;
            career: number;
            overall: number;
        };
        avgCultureRating?: never;
        avgWorklifeRating?: never;
        avgFacilityRating?: never;
        avgCareerRating?: never;
        avgCompanyRating?: never;
        avgOverallRating?: never;
        ratingDistribution?: never;
    } | {
        totalReviews: number;
        avgCultureRating: string;
        avgWorklifeRating: string;
        avgFacilityRating: string;
        avgCareerRating: string;
        avgCompanyRating: string;
        avgOverallRating: string;
        ratingDistribution: {
            rating: number;
            count: number;
        }[];
        averageRatings?: never;
    }>;
    static getCompanyRating(companyId: number | string): Promise<{
        companyId: number;
        companyName: string;
        companyRating: number;
        totalReviews: number;
    } | null>;
    private static calculateOverallRating;
    private static formatRating;
    private static getRatingDistribution;
    private static getValidRatings;
    private static calculateAverageRating;
}
//# sourceMappingURL=ReviewStatsQuery.repository.d.ts.map