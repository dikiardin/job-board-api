export interface CreateReviewData {
    userId: number;
    companyId: number;
    position: string;
    salaryEstimate?: number;
    cultureRating: number;
    worklifeRating: number;
    facilityRating: number;
    careerRating: number;
    comment?: string;
}
export interface GetReviewsParams {
    companyId: number;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: string;
}
export declare class CompanyReviewService {
    static getCompanyReviews(params: GetReviewsParams): Promise<{
        reviews: {
            createdAt: Date;
            id: number;
            position: string;
            salaryEstimate: number | null;
            cultureRating: import("../../generated/prisma/runtime/library").Decimal | null;
            worklifeRating: import("../../generated/prisma/runtime/library").Decimal | null;
            facilityRating: import("../../generated/prisma/runtime/library").Decimal | null;
            careerRating: import("../../generated/prisma/runtime/library").Decimal | null;
            comment: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getCompanyReviewStats(companyId: number): Promise<{
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
        id: number;
        position: string;
        salaryEstimate: number | null;
        cultureRating: import("../../generated/prisma/runtime/library").Decimal | null;
        worklifeRating: import("../../generated/prisma/runtime/library").Decimal | null;
        facilityRating: import("../../generated/prisma/runtime/library").Decimal | null;
        careerRating: import("../../generated/prisma/runtime/library").Decimal | null;
        comment: string | null;
    }>;
    static checkReviewEligibility(userId: number, companyId: number): Promise<{
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
    static getUserReview(userId: number, companyId: number): Promise<{
        createdAt: Date;
        id: number;
        position: string;
        salaryEstimate: number | null;
        cultureRating: import("../../generated/prisma/runtime/library").Decimal | null;
        worklifeRating: import("../../generated/prisma/runtime/library").Decimal | null;
        facilityRating: import("../../generated/prisma/runtime/library").Decimal | null;
        careerRating: import("../../generated/prisma/runtime/library").Decimal | null;
        comment: string | null;
    }>;
    static updateReview(data: CreateReviewData): Promise<{
        createdAt: Date;
        id: number;
        position: string;
        salaryEstimate: number | null;
        cultureRating: import("../../generated/prisma/runtime/library").Decimal | null;
        worklifeRating: import("../../generated/prisma/runtime/library").Decimal | null;
        facilityRating: import("../../generated/prisma/runtime/library").Decimal | null;
        careerRating: import("../../generated/prisma/runtime/library").Decimal | null;
        comment: string | null;
    }>;
    static deleteReview(userId: number, companyId: number): Promise<void>;
    static getSalaryEstimates(companyId: number): Promise<{
        position: string;
        count: number;
        averageSalary: number;
        minSalary: number;
        maxSalary: number;
    }[]>;
}
//# sourceMappingURL=companyReview.service.d.ts.map