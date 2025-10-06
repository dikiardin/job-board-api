import { GetReviewsParams } from "./ReviewQueryService";
import { CreateReviewData } from "./ReviewManagementService";
export { CreateReviewData, GetReviewsParams };
export declare class CompanyReviewService {
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
            companyRating: import("../../generated/prisma/runtime/library").Decimal | null;
            salaryEstimateMin: number | null;
            salaryEstimateMax: number | null;
            reviewerSnapshot: string | null;
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
    static createReview(data: CreateReviewData): Promise<{
        createdAt: Date;
        id: number;
        positionTitle: string;
        body: string | null;
        ratingCulture: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingWorkLife: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingFacilities: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingCareer: import("../../generated/prisma/runtime/library").Decimal | null;
        companyRating: import("../../generated/prisma/runtime/library").Decimal | null;
        salaryEstimateMin: number | null;
        salaryEstimateMax: number | null;
    }>;
    static checkReviewEligibility(userId: number, companyId: string): Promise<{
        isEligible: boolean;
        canReview: boolean;
        hasExistingReview: boolean;
        message: string;
    }>;
    static getUserReview(userId: number, companyId: string): Promise<any>;
    static updateReview(data: CreateReviewData): Promise<{
        createdAt: Date;
        id: number;
        positionTitle: string;
        body: string | null;
        ratingCulture: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingWorkLife: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingFacilities: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingCareer: import("../../generated/prisma/runtime/library").Decimal | null;
        companyRating: import("../../generated/prisma/runtime/library").Decimal | null;
        salaryEstimateMin: number | null;
        salaryEstimateMax: number | null;
    }>;
    static deleteReview(userId: number, companyId: string): Promise<void>;
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
//# sourceMappingURL=companyReview.service.d.ts.map