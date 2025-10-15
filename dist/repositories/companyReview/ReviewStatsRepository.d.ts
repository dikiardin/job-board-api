export declare class ReviewStatsRepository {
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
    static getSalaryEstimates(companyId: number | string): Promise<{
        position: string;
        count: number;
        averageSalary: string;
        minSalary: number;
        maxSalary: number;
    }[]>;
}
//# sourceMappingURL=ReviewStatsRepository.d.ts.map