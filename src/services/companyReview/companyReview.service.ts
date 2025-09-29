import { CompanyReviewRepository } from "../../repositories/companyReview/companyReview.repository";
import { CustomError } from "../../utils/customError";

export interface CreateReviewData {
  userId: number;
  companyId: number;
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
    const companyExists = await CompanyReviewRepository.checkCompanyExists(companyId);
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
        sortOrder
      }),
      CompanyReviewRepository.getCompanyReviewsCount(companyId)
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Get company review statistics
  public static async getCompanyReviewStats(companyId: number) {
    // Check if company exists
    const companyExists = await CompanyReviewRepository.checkCompanyExists(companyId);
    if (!companyExists) {
      throw new CustomError("Company not found", 404);
    }

    const stats = await CompanyReviewRepository.getCompanyReviewStats(companyId);
    
    return {
      totalReviews: stats.totalReviews,
      averageRatings: {
        culture: parseFloat(stats.avgCultureRating || '0'),
        worklife: parseFloat(stats.avgWorklifeRating || '0'),
        facility: parseFloat(stats.avgFacilityRating || '0'),
        career: parseFloat(stats.avgCareerRating || '0'),
        overall: parseFloat(stats.avgOverallRating || '0')
      },
      ratingDistribution: stats.ratingDistribution
    };
  }

  // Create a new review
  public static async createReview(data: CreateReviewData) {
    const { userId, companyId } = data;

    // Check if user is eligible to review this company
    const eligibility = await this.checkReviewEligibility(userId, companyId);
    if (!eligibility.canReview) {
      throw new CustomError(eligibility.reason || "Not eligible to review this company", 403);
    }

    // Validate rating values (1-5)
    const ratings = [data.cultureRating, data.worklifeRating, data.facilityRating, data.careerRating];
    for (const rating of ratings) {
      if (rating < 1 || rating > 5) {
        throw new CustomError("Rating values must be between 1 and 5", 400);
      }
    }

    // Create the review
    const reviewData: any = {
      employmentId: eligibility.employmentId!,
      position: data.position,
      cultureRating: data.cultureRating,
      worklifeRating: data.worklifeRating,
      facilityRating: data.facilityRating,
      careerRating: data.careerRating
    };

    if (data.salaryEstimate !== undefined) {
      reviewData.salaryEstimate = data.salaryEstimate;
    }

    if (data.comment !== undefined) {
      reviewData.comment = data.comment;
    }

    const review = await CompanyReviewRepository.createReview(reviewData);

    return review;
  }

  // Check if user can review a company
  public static async checkReviewEligibility(userId: number, companyId: number) {
    // Check if company exists
    const companyExists = await CompanyReviewRepository.checkCompanyExists(companyId);
    if (!companyExists) {
      return { canReview: false, reason: "Company not found" };
    }

    // Check if user has employment record with this company
    const employment = await CompanyReviewRepository.getUserEmployment(userId, companyId);
    if (!employment) {
      return { canReview: false, reason: "You must be an employee of this company to leave a review" };
    }

    // Check if user has already reviewed this company
    const existingReview = await CompanyReviewRepository.getExistingReview(employment.id);
    if (existingReview) {
      return { canReview: false, reason: "You have already reviewed this company" };
    }

    return { 
      canReview: true, 
      employmentId: employment.id,
      employment: {
        startDate: employment.startDate,
        endDate: employment.endDate,
        isCurrentEmployee: !employment.endDate
      }
    };
  }

  // Get user's own review for a company
  public static async getUserReview(userId: number, companyId: number) {
    const employment = await CompanyReviewRepository.getUserEmployment(userId, companyId);
    if (!employment) {
      throw new CustomError("Employment record not found", 404);
    }

    const review = await CompanyReviewRepository.getExistingReview(employment.id);
    if (!review) {
      throw new CustomError("Review not found", 404);
    }

    return review;
  }

  // Update user's review
  public static async updateReview(data: CreateReviewData) {
    const { userId, companyId } = data;

    const employment = await CompanyReviewRepository.getUserEmployment(userId, companyId);
    if (!employment) {
      throw new CustomError("Employment record not found", 404);
    }

    const existingReview = await CompanyReviewRepository.getExistingReview(employment.id);
    if (!existingReview) {
      throw new CustomError("Review not found", 404);
    }

    // Validate rating values (1-5)
    const ratings = [data.cultureRating, data.worklifeRating, data.facilityRating, data.careerRating];
    for (const rating of ratings) {
      if (rating < 1 || rating > 5) {
        throw new CustomError("Rating values must be between 1 and 5", 400);
      }
    }

    const updateData: any = {
      position: data.position,
      cultureRating: data.cultureRating,
      worklifeRating: data.worklifeRating,
      facilityRating: data.facilityRating,
      careerRating: data.careerRating
    };

    if (data.salaryEstimate !== undefined) {
      updateData.salaryEstimate = data.salaryEstimate;
    }

    if (data.comment !== undefined) {
      updateData.comment = data.comment;
    }

    const updatedReview = await CompanyReviewRepository.updateReview(existingReview.id, updateData);

    return updatedReview;
  }

  // Delete user's review
  public static async deleteReview(userId: number, companyId: number) {
    const employment = await CompanyReviewRepository.getUserEmployment(userId, companyId);
    if (!employment) {
      throw new CustomError("Employment record not found", 404);
    }

    const existingReview = await CompanyReviewRepository.getExistingReview(employment.id);
    if (!existingReview) {
      throw new CustomError("Review not found", 404);
    }

    await CompanyReviewRepository.deleteReview(existingReview.id);
  }

  // Get salary estimates by position for a company
  public static async getSalaryEstimates(companyId: number) {
    // Check if company exists
    const companyExists = await CompanyReviewRepository.checkCompanyExists(companyId);
    if (!companyExists) {
      throw new CustomError("Company not found", 404);
    }

    const salaryEstimates = await CompanyReviewRepository.getSalaryEstimates(companyId);
    
    return salaryEstimates.map(estimate => ({
      position: estimate.position,
      count: estimate.count,
      averageSalary: parseFloat(estimate.averageSalary || '0'),
      minSalary: estimate.minSalary,
      maxSalary: estimate.maxSalary
    }));
  }
}
