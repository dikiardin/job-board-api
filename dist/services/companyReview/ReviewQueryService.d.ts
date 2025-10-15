export interface GetReviewsParams {
    companyId: string;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: string;
}
export declare class ReviewQueryService {
    static getCompanyReviews(params: GetReviewsParams): Promise<{
        reviews: {
            createdAt: Date;
            id: number;
            positionTitle: string;
            body: string | null;
            isAnonymous: boolean;
            ratingCulture: import("../../generated/prisma/runtime/library").Decimal | null;
            ratingWorkLife: import("../../generated/prisma/runtime/library").Decimal | null;
            ratingFacilities: import("../../generated/prisma/runtime/library").Decimal | null;
            ratingCareer: import("../../generated/prisma/runtime/library").Decimal | null;
            salaryEstimateMin: number | null;
            salaryEstimateMax: number | null;
            reviewerSnapshot: string | null;
            companyRating: import("../../generated/prisma/runtime/library").Decimal | null;
            reviewer: {
                email: string;
                name: string | null;
                id: number;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getCompanyReviewStats(companyId: string): Promise<{
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
    static getCompanyReviewers(companyId: string): Promise<{
        createdAt: Date;
        id: number;
        positionTitle: string;
        isAnonymous: boolean;
        reviewerSnapshot: string | null;
        reviewer: {
            email: string;
            name: string | null;
            id: number;
        };
    }[]>;
    static getSalaryEstimates(companyId: string): Promise<{
        position: string;
        count: number;
        averageSalary: number;
        minSalary: number;
        maxSalary: number;
    }[]>;
    static getCompanyRating(companyId: string): Promise<{
        companyId: number;
        companyName: string;
        companyRating: number;
        totalReviews: number;
    }>;
}
//# sourceMappingURL=ReviewQueryService.d.ts.map