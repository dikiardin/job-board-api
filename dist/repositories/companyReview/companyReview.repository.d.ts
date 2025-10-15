import { GetReviewsParams } from "./ReviewQueryRepository";
import { CreateReviewData, UpdateReviewData } from "./ReviewMutationRepository";
export { CreateReviewData, UpdateReviewData, GetReviewsParams };
export declare class CompanyReviewRepository {
    static checkCompanyExists(companyId: number | string): Promise<boolean>;
    static getUserEmployment(userId: number, companyId: number | string): Promise<{
        id: number;
        startDate: Date | null;
        endDate: Date | null;
    } | null>;
    static getUserVerifiedEmployment(userId: number, companyId: number | string): Promise<{
        createdAt: Date;
        id: number;
        positionTitle: string | null;
        startDate: Date | null;
        endDate: Date | null;
        isCurrent: boolean;
        company: {
            name: string;
            id: number;
        } | null;
    } | null>;
    static getExistingReview(employmentId: number): Promise<{
        createdAt: Date;
        id: number;
        positionTitle: string;
        body: string | null;
        ratingCulture: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingWorkLife: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingFacilities: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingCareer: import("../../generated/prisma/runtime/library").Decimal | null;
        salaryEstimateMin: number | null;
        salaryEstimateMax: number | null;
        companyRating: import("../../generated/prisma/runtime/library").Decimal | null;
    } | null>;
    static getExistingReviewByUserAndCompany(userId: number, companyId: number | string): Promise<{
        createdAt: Date;
        id: number;
        positionTitle: string;
        body: string | null;
        ratingCulture: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingWorkLife: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingFacilities: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingCareer: import("../../generated/prisma/runtime/library").Decimal | null;
        salaryEstimateMin: number | null;
        salaryEstimateMax: number | null;
        companyRating: import("../../generated/prisma/runtime/library").Decimal | null;
    } | null>;
    static getCompanyReviews(params: GetReviewsParams): Promise<{
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
    }[]>;
    static getCompanyReviewsCount(companyId: number | string): Promise<number>;
    static getCompanyReviewers(companyId: number | string): Promise<{
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
        salaryEstimateMin: number | null;
        salaryEstimateMax: number | null;
        companyRating: import("../../generated/prisma/runtime/library").Decimal | null;
    }>;
    static updateReview(reviewId: number, data: UpdateReviewData): Promise<{
        createdAt: Date;
        id: number;
        positionTitle: string;
        body: string | null;
        ratingCulture: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingWorkLife: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingFacilities: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingCareer: import("../../generated/prisma/runtime/library").Decimal | null;
        salaryEstimateMin: number | null;
        salaryEstimateMax: number | null;
        companyRating: import("../../generated/prisma/runtime/library").Decimal | null;
    }>;
    static deleteReview(reviewId: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        positionTitle: string;
        companyId: number;
        body: string | null;
        employmentId: number | null;
        reviewerUserId: number;
        isVerifiedEmployee: boolean;
        isAnonymous: boolean;
        ratingCulture: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingWorkLife: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingFacilities: import("../../generated/prisma/runtime/library").Decimal | null;
        ratingCareer: import("../../generated/prisma/runtime/library").Decimal | null;
        salaryEstimateMin: number | null;
        salaryEstimateMax: number | null;
        currency: string | null;
        reviewerSnapshot: string | null;
        companyRating: import("../../generated/prisma/runtime/library").Decimal | null;
    }>;
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
//# sourceMappingURL=companyReview.repository.d.ts.map