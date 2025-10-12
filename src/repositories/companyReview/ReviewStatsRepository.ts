import { ReviewStatsQueryRepository } from "./ReviewStatsQuery.repository";
import { ReviewSalaryRepository } from "./ReviewSalary.repository";

export class ReviewStatsRepository {
  // Get company review statistics
  public static async getCompanyReviewStats(companyId: number | string) {
    return ReviewStatsQueryRepository.getCompanyReviewStats(companyId);
  }

  // Get overall company rating (average of all companyRating from reviews)
  public static async getCompanyRating(companyId: number | string) {
    return ReviewStatsQueryRepository.getCompanyRating(companyId);
  }

  // Get salary estimates by position for a company
  public static async getSalaryEstimates(companyId: number | string) {
    return ReviewSalaryRepository.getSalaryEstimates(companyId);
  }
}
