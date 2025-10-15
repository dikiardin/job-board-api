export interface GetReviewsParams {
    companyId: number | string;
    limit: number;
    offset: number;
    sortBy: string;
    sortOrder: string;
}
export declare class ReviewQueryRepository {
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
}
//# sourceMappingURL=ReviewQueryRepository.d.ts.map