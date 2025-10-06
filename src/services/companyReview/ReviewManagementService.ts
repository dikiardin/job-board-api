import { CompanyReviewRepository } from "../../repositories/companyReview/companyReview.repository";
import { CompanyValidationService } from "./helpers/CompanyValidationService";
import { ReviewValidationService } from "./helpers/ReviewValidationService";
import { EligibilityService } from "./helpers/EligibilityService";
import { CustomError } from "../../utils/customError";

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

export class ReviewManagementService {
  // Create a new review
  public static async createReview(data: CreateReviewData) {
    const { userId, companyId } = data;

    // Check eligibility
    const eligibility = await EligibilityService.checkUserEligibility(userId, companyId);
    if (!eligibility.canReview) {
      throw new CustomError(eligibility.message || "Not eligible to review this company", 403);
    }

    // Validate rating values
    const ratings = [
      data.ratingCulture,
      data.ratingWorkLife,
      data.ratingFacilities,
      data.ratingCareer,
    ];
    ReviewValidationService.validateRatingValues(ratings);

    // Build review data
    const reviewData = ReviewValidationService.buildReviewData(data, eligibility);

    // Create the review
    const review = await CompanyReviewRepository.createReview(reviewData);
    return review;
  }

  // Get user's own review for a company
  public static async getUserReview(userId: number, companyId: string) {
    await CompanyValidationService.validateUserEmployment(userId, companyId);
    const review = await CompanyValidationService.validateExistingReview(userId, companyId);
    return review;
  }

  // Update user's review
  public static async updateReview(data: CreateReviewData) {
    const { userId, companyId } = data;

    await CompanyValidationService.validateUserEmployment(userId, companyId);
    const existingReview = await CompanyValidationService.validateExistingReview(userId, companyId);

    // Validate rating values
    const ratings = [
      data.ratingCulture,
      data.ratingWorkLife,
      data.ratingFacilities,
      data.ratingCareer,
    ];
    ReviewValidationService.validateRatingValues(ratings);

    // Calculate company rating
    const companyRating = ReviewValidationService.calculateCompanyRating(
      data.ratingCulture,
      data.ratingWorkLife,
      data.ratingFacilities,
      data.ratingCareer
    );

    const updateData: any = {
      positionTitle: data.positionTitle,
      ratingCulture: data.ratingCulture,
      ratingWorkLife: data.ratingWorkLife,
      ratingFacilities: data.ratingFacilities,
      ratingCareer: data.ratingCareer,
      companyRating: companyRating,
    };

    if (data.salaryEstimateMin !== undefined) {
      updateData.salaryEstimateMin = data.salaryEstimateMin;
    }
    
    if (data.salaryEstimateMax !== undefined) {
      updateData.salaryEstimateMax = data.salaryEstimateMax;
    }

    if (data.body !== undefined) {
      updateData.body = data.body;
    }

    const updatedReview = await CompanyReviewRepository.updateReview(
      existingReview.id,
      updateData
    );

    return updatedReview;
  }

  // Delete user's review
  public static async deleteReview(userId: number, companyId: string) {
    await CompanyValidationService.validateUserEmployment(userId, companyId);
    const existingReview = await CompanyValidationService.validateExistingReview(userId, companyId);
    await CompanyReviewRepository.deleteReview(existingReview.id);
  }
}
