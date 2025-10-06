import { CompanyValidationRepository } from "./CompanyValidationRepository";
import { ReviewQueryRepository, GetReviewsParams } from "./ReviewQueryRepository";
import { ReviewMutationRepository, CreateReviewData, UpdateReviewData } from "./ReviewMutationRepository";
import { ReviewStatsRepository } from "./ReviewStatsRepository";

export { CreateReviewData, UpdateReviewData, GetReviewsParams };

export class CompanyReviewRepository {
  // Company validation methods
  public static async checkCompanyExists(companyId: number | string): Promise<boolean> {
    return await CompanyValidationRepository.checkCompanyExists(companyId);
  }

  public static async getUserEmployment(userId: number, companyId: number | string) {
    return await CompanyValidationRepository.getUserEmployment(userId, companyId);
  }

  public static async getUserVerifiedEmployment(userId: number, companyId: number | string) {
    return await CompanyValidationRepository.getUserVerifiedEmployment(userId, companyId);
  }

  // Review query methods
  public static async getExistingReview(employmentId: number) {
    return await ReviewQueryRepository.getExistingReview(employmentId);
  }

  public static async getExistingReviewByUserAndCompany(userId: number, companyId: number | string) {
    return await ReviewQueryRepository.getExistingReviewByUserAndCompany(userId, companyId);
  }

  public static async getCompanyReviews(params: GetReviewsParams) {
    return await ReviewQueryRepository.getCompanyReviews(params);
  }

  public static async getCompanyReviewsCount(companyId: number | string): Promise<number> {
    return await ReviewQueryRepository.getCompanyReviewsCount(companyId);
  }

  public static async getCompanyReviewers(companyId: number | string) {
    return await ReviewQueryRepository.getCompanyReviewers(companyId);
  }

  // Review mutation methods
  public static async createReview(data: CreateReviewData) {
    return await ReviewMutationRepository.createReview(data);
  }

  public static async updateReview(reviewId: number, data: UpdateReviewData) {
    return await ReviewMutationRepository.updateReview(reviewId, data);
  }

  public static async deleteReview(reviewId: number) {
    return await ReviewMutationRepository.deleteReview(reviewId);
  }

  // Review statistics methods
  public static async getCompanyReviewStats(companyId: number | string) {
    return await ReviewStatsRepository.getCompanyReviewStats(companyId);
  }

  public static async getCompanyRating(companyId: number | string) {
    return await ReviewStatsRepository.getCompanyRating(companyId);
  }

  public static async getSalaryEstimates(companyId: number | string) {
    return await ReviewStatsRepository.getSalaryEstimates(companyId);
  }
}
