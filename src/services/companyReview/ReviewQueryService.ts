import { CompanyReviewRepository } from "../../repositories/companyReview/companyReview.repository";
import { CompanyValidationService } from "./helpers/CompanyValidationService";
import { CustomError } from "../../utils/customError";

export interface GetReviewsParams {
  companyId: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
}

export class ReviewQueryService {
  // Get all reviews for a company with pagination
  public static async getCompanyReviews(params: GetReviewsParams) {
    const { companyId, page, limit, sortBy, sortOrder } = params;

    await CompanyValidationService.validateCompanyExists(companyId);

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
    await CompanyValidationService.validateCompanyExists(companyId);
    return await CompanyReviewRepository.getCompanyReviewStats(companyId);
  }

  // Get company reviewers (shows who reviewed the company)
  public static async getCompanyReviewers(companyId: string) {
    await CompanyValidationService.validateCompanyExists(companyId);
    return await CompanyReviewRepository.getCompanyReviewers(companyId);
  }

  // Get salary estimates by position for a company
  public static async getSalaryEstimates(companyId: string) {
    await CompanyValidationService.validateCompanyExists(companyId);
    const salaryEstimates = await CompanyReviewRepository.getSalaryEstimates(companyId);

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
