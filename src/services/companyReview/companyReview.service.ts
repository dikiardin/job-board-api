import { ReviewQueryService, GetReviewsParams } from "./ReviewQueryService";
import { ReviewManagementService, CreateReviewData } from "./ReviewManagementService";
import { EligibilityService } from "./helpers/EligibilityService";

export { CreateReviewData, GetReviewsParams };

export class CompanyReviewService {
  // Get all reviews for a company with pagination
  public static async getCompanyReviews(params: GetReviewsParams) {
    return await ReviewQueryService.getCompanyReviews(params);
  }

  // Get company review statistics
  public static async getCompanyReviewStats(companyId: string) {
    return await ReviewQueryService.getCompanyReviewStats(companyId);
  }

  // Get company reviewers (shows who reviewed the company)
  public static async getCompanyReviewers(companyId: string) {
    return await ReviewQueryService.getCompanyReviewers(companyId);
  }

  // Create a new review
  public static async createReview(data: CreateReviewData) {
    return await ReviewManagementService.createReview(data);
  }

  // Check if user can review a company
  public static async checkReviewEligibility(userId: number, companyId: string) {
    return await EligibilityService.checkUserEligibility(userId, companyId);
  }

  // Get user's own review for a company
  public static async getUserReview(userId: number, companyId: string) {
    return await ReviewManagementService.getUserReview(userId, companyId);
  }

  // Update user's review
  public static async updateReview(data: CreateReviewData) {
    return await ReviewManagementService.updateReview(data);
  }

  // Delete user's review
  public static async deleteReview(userId: number, companyId: string) {
    return await ReviewManagementService.deleteReview(userId, companyId);
  }

  // Get salary estimates by position for a company
  public static async getSalaryEstimates(companyId: string) {
    return await ReviewQueryService.getSalaryEstimates(companyId);
  }

  // Get overall company rating
  public static async getCompanyRating(companyId: string) {
    return await ReviewQueryService.getCompanyRating(companyId);
  }
}
