export interface CreateReviewData {
    userId: number;
    companyId: string;
    positionTitle: string;
    salaryEstimateMin?: number;
    salaryEstimateMax?: number;
    ratingCulture: number;
    ratingWorkLife: number;
    ratingFacilities: number;
    ratingCareer: number;
    body?: string;
}
export declare class ReviewManagementService {
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
        salaryEstimateMin: number | null;
        salaryEstimateMax: number | null;
        companyRating: import("../../generated/prisma/runtime/library").Decimal | null;
    }>;
    private static validateUpdateData;
    private static buildUpdateData;
    static deleteReview(userId: number, companyId: string): Promise<void>;
}
//# sourceMappingURL=ReviewManagementService.d.ts.map