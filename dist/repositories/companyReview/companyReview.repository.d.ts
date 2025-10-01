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
    companyId: number;
    limit: number;
    offset: number;
    sortBy: string;
    sortOrder: string;
}
export declare class CompanyReviewRepository {
    static checkCompanyExists(companyId: number): Promise<boolean>;
    static getUserEmployment(userId: number, companyId: number): Promise<{
        id: number;
        startDate: Date | null;
        endDate: Date | null;
    } | null>;
    static getExistingReview(employmentId: number): Promise<{
        createdAt: Date;
        id: number;
        position: string;
        salaryEstimate: number | null;
        cultureRating: number;
        worklifeRating: number;
        facilityRating: number;
        careerRating: number;
        comment: string | null;
    } | null>;
    static createReview(data: CreateReviewData): Promise<{
        createdAt: Date;
        id: number;
        position: string;
        salaryEstimate: number | null;
        cultureRating: number;
        worklifeRating: number;
        facilityRating: number;
        careerRating: number;
        comment: string | null;
    }>;
    static updateReview(reviewId: number, data: UpdateReviewData): Promise<{
        createdAt: Date;
        id: number;
        position: string;
        salaryEstimate: number | null;
        cultureRating: number;
        worklifeRating: number;
        facilityRating: number;
        careerRating: number;
        comment: string | null;
    }>;
    static deleteReview(reviewId: number): Promise<{
        createdAt: Date;
        id: number;
        position: string;
        employmentId: number;
        salaryEstimate: number | null;
        cultureRating: number;
        worklifeRating: number;
        facilityRating: number;
        careerRating: number;
        comment: string | null;
    }>;
    static getCompanyReviews(params: GetReviewsParams): Promise<{
        createdAt: Date;
        id: number;
        position: string;
        salaryEstimate: number | null;
        cultureRating: number;
        worklifeRating: number;
        facilityRating: number;
        careerRating: number;
        comment: string | null;
    }[]>;
    static getCompanyReviewsCount(companyId: number): Promise<number>;
    static getCompanyReviewStats(companyId: number): Promise<{
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
    static getSalaryEstimates(companyId: number): Promise<{
        position: string;
        count: number;
        averageSalary: string;
        minSalary: number;
        maxSalary: number;
    }[]>;
}
//# sourceMappingURL=companyReview.repository.d.ts.map