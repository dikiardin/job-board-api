import { CompanyReviewRepository } from "../../repositories/companyReview/companyReview.repository";
import { CustomError } from "../../utils/customError";

export interface CreateReviewData {
  userId: number;
  companyId: string;
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
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
}

export class CompanyReviewService {
  // Get all reviews for a company with pagination
  public static async getCompanyReviews(params: GetReviewsParams) {
    const { companyId, page, limit, sortBy, sortOrder } = params;

    // Check if company exists
    const companyExists = await CompanyReviewRepository.checkCompanyExists(
      companyId
    );
    if (!companyExists) {
      throw new CustomError("Company not found", 404);
    }

    const offset = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      CompanyReviewRepository.getCompanyReviews({
        companyId,
        limit,
        offset,
        sortBy,
        sortOrder,
      }),
      CompanyReviewRepository.getCompanyReviewsCount(companyId),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get company review statistics
  public static async getCompanyReviewStats(companyId: string) {
    // Check if company exists
    const companyExists = await CompanyReviewRepository.checkCompanyExists(companyId);
    if (!companyExists) {
      throw new CustomError("Company not found", 404);
    }

    return await CompanyReviewRepository.getCompanyReviewStats(companyId);
  }

  // Create a new review
  public static async createReview(data: CreateReviewData) {
    const { userId, companyId } = data;

    // Check if user is eligible to review this company
    const eligibility = await this.checkReviewEligibility(userId, companyId);
    if (!eligibility.canReview) {
      throw new CustomError(
        eligibility.reason || "Not eligible to review this company",
        403
      );
    }

    // Validate rating values (1-5)
    const ratings = [
      data.cultureRating,
      data.worklifeRating,
      data.facilityRating,
      data.careerRating,
    ];
    for (const rating of ratings) {
      if (rating < 1 || rating > 5) {
        throw new CustomError("Rating values must be between 1 and 5", 400);
      }
    }

    // Calculate company rating (average of 4 ratings)
    const companyRating = (
      data.cultureRating + 
      data.worklifeRating + 
      data.facilityRating + 
      data.careerRating
    ) / 4;

    // Create the review (UPDATED LOGIC - include employmentId and calculated companyRating)
    const reviewData: any = {
      companyId: parseInt(companyId),
      employmentId: eligibility.employmentId, // Add employmentId from eligibility check
      reviewerUserId: userId,
      positionTitle: data.position,
      ratingCulture: data.cultureRating,
      ratingWorkLife: data.worklifeRating,
      ratingFacilities: data.facilityRating,
      ratingCareer: data.careerRating,
      companyRating: companyRating, // Auto-calculated average
    };

    if (data.salaryEstimate !== undefined) {
      reviewData.salaryEstimateMin = data.salaryEstimate;
      reviewData.salaryEstimateMax = data.salaryEstimate;
    }

    if (data.comment !== undefined) {
      reviewData.body = data.comment;
    }

    const review = await CompanyReviewRepository.createReview(reviewData);

    return review;
  }

  // Check if user can review a company
  public static async checkReviewEligibility(
    userId: number,
    companyId: string
  ) {
    // Check if company exists
    const companyExists = await CompanyReviewRepository.checkCompanyExists(
      companyId
    );
    if (!companyExists) {
      return { canReview: false, reason: "Company not found" };
    }

    // Check if user has verified employment with this company (UPDATED LOGIC)
    const verifiedEmployment = await CompanyReviewRepository.getUserVerifiedEmployment(
      userId,
      companyId
    );
    if (!verifiedEmployment) {
      return {
        canReview: false,
        reason: "You must have verified employment with this company to leave a review",
      };
    }

    // Check if user has already reviewed this company
    const existingReview = await CompanyReviewRepository.getExistingReviewByUserAndCompany(
      userId,
      companyId
    );
    if (existingReview) {
      return {
        canReview: false,
        reason: "You have already reviewed this company",
      };
    }

    return {
      canReview: true,
      employmentId: verifiedEmployment.id,
      employment: {
        companyName: verifiedEmployment.company?.name || "Unknown Company",
        startDate: verifiedEmployment.startDate,
        endDate: verifiedEmployment.endDate,
        verifiedAt: verifiedEmployment.createdAt,
      },
    };
  }

  // Get user's own review for a company
  public static async getUserReview(userId: number, companyId: string) {
    // Check if user has verified employment with this company
    const verifiedEmployment = await CompanyReviewRepository.getUserVerifiedEmployment(
      userId,
      companyId
    );
    if (!verifiedEmployment) {
      throw new CustomError("You must have verified employment with this company", 404);
    }

    const review = await CompanyReviewRepository.getExistingReviewByUserAndCompany(
      userId,
      companyId
    );
    if (!review) {
      throw new CustomError("Review not found", 404);
    }

    return review;
  }

  // Update user's review
  public static async updateReview(data: CreateReviewData) {
    const { userId, companyId } = data;

    // Check if user has verified employment with this company
    const verifiedEmployment = await CompanyReviewRepository.getUserVerifiedEmployment(
      userId,
      companyId
    );
    if (!verifiedEmployment) {
      throw new CustomError("You must have verified employment with this company", 404);
    }

    const existingReview = await CompanyReviewRepository.getExistingReviewByUserAndCompany(
      userId,
      companyId
    );
    if (!existingReview) {
      throw new CustomError("Review not found", 404);
    }

    // Validate rating values (1-5)
    const ratings = [
      data.cultureRating,
      data.worklifeRating,
      data.facilityRating,
      data.careerRating,
    ];
    for (const rating of ratings) {
      if (rating < 1 || rating > 5) {
        throw new CustomError("Rating values must be between 1 and 5", 400);
      }
    }

    // Calculate company rating (average of 4 ratings)
    const companyRating = (
      data.cultureRating + 
      data.worklifeRating + 
      data.facilityRating + 
      data.careerRating
    ) / 4;

    const updateData: any = {
      positionTitle: data.position,
      ratingCulture: data.cultureRating,
      ratingWorkLife: data.worklifeRating,
      ratingFacilities: data.facilityRating,
      ratingCareer: data.careerRating,
      companyRating: companyRating, // Auto-calculated average
    };

    if (data.salaryEstimate !== undefined) {
      updateData.salaryEstimateMin = data.salaryEstimate;
      updateData.salaryEstimateMax = data.salaryEstimate;
    }

    if (data.comment !== undefined) {
      updateData.body = data.comment;
    }

    const updatedReview = await CompanyReviewRepository.updateReview(
      existingReview.id,
      updateData
    );

    return updatedReview;
  }

  // Delete user's review
  public static async deleteReview(userId: number, companyId: string) {
    // Check if user has verified employment with this company
    const verifiedEmployment = await CompanyReviewRepository.getUserVerifiedEmployment(
      userId,
      companyId
    );
    if (!verifiedEmployment) {
      throw new CustomError("You must have verified employment with this company", 404);
    }

    const existingReview = await CompanyReviewRepository.getExistingReviewByUserAndCompany(
      userId,
      companyId
    );
    if (!existingReview) {
      throw new CustomError("Review not found", 404);
    }

    await CompanyReviewRepository.deleteReview(existingReview.id);
  }

  // Get salary estimates by position for a company
  public static async getSalaryEstimates(companyId: string) {
    // Check if company exists
    const companyExists = await CompanyReviewRepository.checkCompanyExists(
      companyId
    );
    if (!companyExists) {
      throw new CustomError("Company not found", 404);
    }
    const salaryEstimates = await CompanyReviewRepository.getSalaryEstimates(
      companyId
    );

    return salaryEstimates.map((estimate) => ({
      position: estimate.position,
      count: estimate.count,
      averageSalary: parseFloat(estimate.averageSalary || "0"),
      minSalary: estimate.minSalary,
      maxSalary: estimate.maxSalary,
    }));
  }

  // Get overall company rating
  public static async getCompanyRating(companyId: string) {
    const result = await CompanyReviewRepository.getCompanyRating(companyId);
    
    if (!result) {
      throw new CustomError("Company not found", 404);
    }

    return result;
  }
}
