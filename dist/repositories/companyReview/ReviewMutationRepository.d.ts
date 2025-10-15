export interface CreateReviewData {
    companyId: number;
    employmentId?: number;
    reviewerUserId: number;
    positionTitle: string;
    salaryEstimateMin?: number;
    salaryEstimateMax?: number;
    ratingCulture: number;
    ratingWorkLife: number;
    ratingFacilities: number;
    ratingCareer: number;
    companyRating: number;
    body?: string;
}
export interface UpdateReviewData {
    positionTitle: string;
    salaryEstimateMin?: number;
    salaryEstimateMax?: number;
    ratingCulture: number;
    ratingWorkLife: number;
    ratingFacilities: number;
    ratingCareer: number;
    companyRating: number;
    body?: string;
}
export declare class ReviewMutationRepository {
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
}
//# sourceMappingURL=ReviewMutationRepository.d.ts.map