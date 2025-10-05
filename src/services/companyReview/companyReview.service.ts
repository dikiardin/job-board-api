import { CompanyReviewRepository } from "../../repositories/companyReview/companyReview.repository";
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
    const companyExists = await CompanyReviewRepository.checkCompanyExists(companyId);
    if (!companyExists) {
      throw new CustomError("Company not found", 404);
    }

    return await CompanyReviewRepository.getCompanyReviewStats(companyId);
  }

  // Get company reviewers (shows who reviewed the company)
  public static async getCompanyReviewers(companyId: string) {
    // Check if company exists
    const companyExists = await CompanyReviewRepository.checkCompanyExists(companyId);
    if (!companyExists) {
      throw new CustomError("Company not found", 404);
    }

    return await CompanyReviewRepository.getCompanyReviewers(companyId);
  }

  // Create a new review
  public static async createReview(data: CreateReviewData) {
    const { userId, companyId } = data;

    // Check eligibility
    const eligibility = await this.checkReviewEligibility(userId, companyId);
    if (!eligibility.canReview) {
      throw new CustomError(
        eligibility.message || "Not eligible to review this company",
        403
      );
    }

    // Validate rating values (0.1-5.0)
    const ratings = [
      data.ratingCulture,
      data.ratingWorkLife,
      data.ratingFacilities,
      data.ratingCareer,
    ];
    for (const rating of ratings) {
      if (rating < 0.1 || rating > 5) {
        throw new CustomError("Rating values must be between 0.1 and 5.0", 400);
      }
    }

    // Calculate company rating (average of 4 ratings)
    const companyRating = (
      data.ratingCulture + 
      data.ratingWorkLife + 
      data.ratingFacilities + 
      data.ratingCareer
    ) / 4;

    // Create the review
    const reviewData: any = {
      companyId: parseInt(companyId),
      employmentId: eligibility.employmentId,
      reviewerUserId: userId,
      positionTitle: data.positionTitle,
      ratingCulture: data.ratingCulture,
      ratingWorkLife: data.ratingWorkLife,
      ratingFacilities: data.ratingFacilities,
      ratingCareer: data.ratingCareer,
      companyRating: companyRating,
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
      return { 
        isEligible: false, 
        canReview: false, 
        hasExistingReview: false,
        message: "Company not found" 
      };
    }

    // Check if user has verified employment with this company (UPDATED LOGIC)
    const verifiedEmployment = await CompanyReviewRepository.getUserVerifiedEmployment(
      userId,
      companyId
    );
    if (!verifiedEmployment) {
      return {
        isEligible: false,
        canReview: false,
        hasExistingReview: false,
        message: "You must have verified employment with this company to leave a review",
      };
    }

    // Check if user has already reviewed this company
    const existingReview = await CompanyReviewRepository.getExistingReviewByUserAndCompany(
      userId,
      companyId
    );
    if (existingReview) {
      return {
        isEligible: false,
        canReview: false,
        hasExistingReview: true,
        existingReview: existingReview,
        message: "You have already reviewed this company",
      };
    }

    return {
      isEligible: true,
      canReview: true,
      hasExistingReview: false,
      employmentId: verifiedEmployment.id,
      employment: {
        id: verifiedEmployment.id,
        positionTitle: verifiedEmployment.positionTitle,
        startDate: verifiedEmployment.startDate,
        endDate: verifiedEmployment.endDate,
        isCurrent: verifiedEmployment.isCurrent,
        company: {
          id: verifiedEmployment.company?.id || 0,
          name: verifiedEmployment.company?.name || "Unknown Company",
        }
      },
      message: "You are eligible to review this company",
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

    // Validate rating values (0.1-5.0)
    const ratings = [
      data.ratingCulture,
      data.ratingWorkLife,
      data.ratingFacilities,
      data.ratingCareer,
    ];
    for (const rating of ratings) {
      if (rating < 0.1 || rating > 5) {
        throw new CustomError("Rating values must be between 0.1 and 5.0", 400);
      }
    }

    // Calculate company rating (average of 4 ratings)
    const companyRating = (
      data.ratingCulture + 
      data.ratingWorkLife + 
      data.ratingFacilities + 
      data.ratingCareer
    ) / 4;

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
