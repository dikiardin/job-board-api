export interface CreateReviewData {
    userId: number;
    companyId: string;
    position: string;
    salaryEstimate?: number;
    cultureRating: number;
    worklifeRating: number;
    facilityRating: number;
    careerRating: number;
    comment?: string;
}
export interface GetReviewsParams {
    companyId: string;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: string;
}
export declare class CompanyReviewService {
    static getCompanyReviews(params: GetReviewsParams): Promise<{
        reviews: {
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
            worklife: number;
            facility: number;
            career: number;
            overall: number;
        };
        ratingDistribution: {
            rating: number;
            count: number;
        }[];
    }>;
    static createReview(data: CreateReviewData): Promise<{
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
    }>;
    static checkReviewEligibility(userId: number, companyId: string): Promise<{
        canReview: boolean;
        reason: string;
        employmentId?: never;
        employment?: never;
    } | {
        canReview: boolean;
        employmentId: number;
        employment: {
            startDate: Date | null;
            endDate: Date | null;
            isCurrentEmployee: boolean;
        };
        reason?: never;
    }>;
    static getUserReview(userId: number, companyId: string): Promise<{
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
    }>;
    static updateReview(data: CreateReviewData): Promise<{
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
    }>;
    static deleteReview(userId: number, companyId: string): Promise<void>;
    static getSalaryEstimates(companyId: string): Promise<{
        position: string;
        count: number;
        averageSalary: number;
        minSalary: number;
        maxSalary: number;
    }[]>;
}
//# sourceMappingURL=companyReview.service.d.ts.map