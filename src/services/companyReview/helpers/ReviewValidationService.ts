import { CustomError } from "../../../utils/customError";

export class ReviewValidationService {
  public static validateRatingValues(ratings: number[]): void {
    for (const rating of ratings) {
      if (rating < 0.1 || rating > 5) {
        throw new CustomError("Rating values must be between 0.1 and 5.0", 400);
      }
    }
  }

  public static calculateCompanyRating(
    ratingCulture: number,
    ratingWorkLife: number,
    ratingFacilities: number,
    ratingCareer: number
  ): number {
    return (ratingCulture + ratingWorkLife + ratingFacilities + ratingCareer) / 4;
  }

  public static buildReviewData(data: any, eligibility: any): any {
    const reviewData: any = {
      companyId: parseInt(data.companyId),
      employmentId: eligibility.employmentId,
      reviewerUserId: data.userId,
      positionTitle: data.positionTitle,
      ratingCulture: data.ratingCulture,
      ratingWorkLife: data.ratingWorkLife,
      ratingFacilities: data.ratingFacilities,
      ratingCareer: data.ratingCareer,
      companyRating: this.calculateCompanyRating(
        data.ratingCulture,
        data.ratingWorkLife,
        data.ratingFacilities,
        data.ratingCareer
      ),
    };

    if (data.salaryEstimateMin !== undefined) {
      reviewData.salaryEstimateMin = data.salaryEstimateMin;
    }
    
    if (data.salaryEstimateMax !== undefined) {
      reviewData.salaryEstimateMax = data.salaryEstimateMax;
    }

    if (data.body !== undefined) {
      reviewData.body = data.body;
    }

    return reviewData;
  }
}
