export interface CreateReviewData {
    employmentId: number;
    position: string;
    salaryEstimate?: number;
    cultureRating: number;
    worklifeRating: number;
    facilityRating: number;
    careerRating: number;
    comment?: string;
}
export interface UpdateReviewData {
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
    limit: number;
    offset: number;
    sortBy: string;
    sortOrder: string;
}
export declare class CompanyReviewRepository {
    static checkCompanyExists(companyId: string): Promise<boolean>;
    static getUserEmployment(userId: number, companyId: string): Promise<{
        id: number;
        startDate: Date | null;
        endDate: Date | null;
    } | null>;
    static getExistingReview(employmentId: number): Promise<{
        createdAt: Date;
        id: number;
        position: string;
        salaryEstimate: number | null;
        cultureRating: import("../../generated/prisma/runtime/library").Decimal | null;
        worklifeRating: import("../../generated/prisma/runtime/library").Decimal | null;
        facilityRating: import("../../generated/prisma/runtime/library").Decimal | null;
        careerRating: import("../../generated/prisma/runtime/library").Decimal | null;
        comment: string | null;
    } | null>;
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
    static updateReview(reviewId: number, data: UpdateReviewData): Promise<{
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
    static deleteReview(reviewId: number): Promise<{
        createdAt: Date;
        id: number;
        employmentId: number;
        position: string;
        salaryEstimate: number | null;
        cultureRating: import("../../generated/prisma/runtime/library").Decimal | null;
        worklifeRating: import("../../generated/prisma/runtime/library").Decimal | null;
        facilityRating: import("../../generated/prisma/runtime/library").Decimal | null;
        careerRating: import("../../generated/prisma/runtime/library").Decimal | null;
        comment: string | null;
        companyRating: import("../../generated/prisma/runtime/library").Decimal | null;
    }>;
    static getCompanyReviews(params: GetReviewsParams): Promise<{
        createdAt: Date;
        id: number;
        position: string;
        salaryEstimate: number | null;
        cultureRating: import("../../generated/prisma/runtime/library").Decimal | null;
        worklifeRating: import("../../generated/prisma/runtime/library").Decimal | null;
        facilityRating: import("../../generated/prisma/runtime/library").Decimal | null;
        careerRating: import("../../generated/prisma/runtime/library").Decimal | null;
        comment: string | null;
    }[]>;
    static getCompanyReviewsCount(companyId: string): Promise<number>;
    static getCompanyReviewStats(companyId: string): Promise<{
        totalReviews: number;
        avgCultureRating: string | undefined;
        avgWorklifeRating: string | undefined;
        avgFacilityRating: string | undefined;
        avgCareerRating: string | undefined;
        avgOverallRating: string;
        ratingDistribution: {
            rating: number;
            count: number;
        }[];
    }>;
    static getSalaryEstimates(companyId: string): Promise<{
        position: string;
        count: number;
        averageSalary: string;
        minSalary: number;
        maxSalary: number;
    }[]>;
}
//# sourceMappingURL=companyReview.repository.d.ts.map