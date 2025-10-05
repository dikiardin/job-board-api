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
    const companyExists = await CompanyReviewRepository.checkCompanyExists(
      companyId
    );
    if (!companyExists) {
      throw new CustomError("Company not found", 404);
    }

    const stats = await CompanyReviewRepository.getCompanyReviewStats(
      companyId
    );

    return {
      totalReviews: stats.totalReviews,
      averageRatings: {
        culture: parseFloat(stats.avgCultureRating || "0"),
        worklife: parseFloat(stats.avgWorklifeRating || "0"),
        facility: parseFloat(stats.avgFacilityRating || "0"),
        career: parseFloat(stats.avgCareerRating || "0"),
        overall: parseFloat(stats.avgOverallRating || "0"),
      },
      ratingDistribution: stats.ratingDistribution,
    };
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

    // Create the review (NEW LOGIC - no employmentId needed)
    const reviewData: any = {
      companyId: parseInt(companyId),
      reviewerUserId: userId,
      positionTitle: data.position,
      ratingCulture: data.cultureRating,
      ratingWorkLife: data.worklifeRating,
      ratingFacilities: data.facilityRating,
      ratingCareer: data.careerRating,
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

    // Check if user has been accepted by this company (NEW LOGIC)
    const acceptedApplication = await CompanyReviewRepository.getUserAcceptedApplication(
      userId,
      companyId
    );
    if (!acceptedApplication) {
      return {
        canReview: false,
        reason: "You must have been accepted by this company to leave a review",
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
      applicationId: acceptedApplication.id,
      application: {
        jobTitle: acceptedApplication.job.title,
        jobCategory: acceptedApplication.job.category,
        companyName: acceptedApplication.job.company.name,
        acceptedAt: acceptedApplication.createdAt,
      },
    };
  }

  // Get user's own review for a company
  public static async getUserReview(userId: number, companyId: string) {
    // Check if user has been accepted by this company
    const acceptedApplication = await CompanyReviewRepository.getUserAcceptedApplication(
      userId,
      companyId
    );
    if (!acceptedApplication) {
      throw new CustomError("You must have been accepted by this company", 404);
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

    // Check if user has been accepted by this company
    const acceptedApplication = await CompanyReviewRepository.getUserAcceptedApplication(
      userId,
      companyId
    );
    if (!acceptedApplication) {
      throw new CustomError("You must have been accepted by this company", 404);
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

    const updateData: any = {
      positionTitle: data.position,
      ratingCulture: data.cultureRating,
      ratingWorkLife: data.worklifeRating,
      ratingFacilities: data.facilityRating,
      ratingCareer: data.careerRating,
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
    // Check if user has been accepted by this company
    const acceptedApplication = await CompanyReviewRepository.getUserAcceptedApplication(
      userId,
      companyId
    );
    if (!acceptedApplication) {
      throw new CustomError("You must have been accepted by this company", 404);
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
}
