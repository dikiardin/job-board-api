"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewQueryService = void 0;
const companyReview_repository_1 = require("../../repositories/companyReview/companyReview.repository");
const CompanyValidationService_1 = require("./helpers/CompanyValidationService");
const customError_1 = require("../../utils/customError");
class ReviewQueryService {
    // Get all reviews for a company with pagination
    static async getCompanyReviews(params) {
        const { companyId, page, limit, sortBy, sortOrder } = params;
        await CompanyValidationService_1.CompanyValidationService.validateCompanyExists(companyId);
        const offset = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            companyReview_repository_1.CompanyReviewRepository.getCompanyReviews({
                companyId,
                limit,
                offset,
                sortBy,
                sortOrder,
            }),
            companyReview_repository_1.CompanyReviewRepository.getCompanyReviewsCount(companyId),
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
    static async getCompanyReviewStats(companyId) {
        await CompanyValidationService_1.CompanyValidationService.validateCompanyExists(companyId);
        return await companyReview_repository_1.CompanyReviewRepository.getCompanyReviewStats(companyId);
    }
    // Get company reviewers (shows who reviewed the company)
    static async getCompanyReviewers(companyId) {
        await CompanyValidationService_1.CompanyValidationService.validateCompanyExists(companyId);
        return await companyReview_repository_1.CompanyReviewRepository.getCompanyReviewers(companyId);
    }
    // Get salary estimates by position for a company
    static async getSalaryEstimates(companyId) {
        await CompanyValidationService_1.CompanyValidationService.validateCompanyExists(companyId);
        const salaryEstimates = await companyReview_repository_1.CompanyReviewRepository.getSalaryEstimates(companyId);
        return salaryEstimates.map((estimate) => ({
            position: estimate.position,
            count: estimate.count,
            averageSalary: parseFloat(estimate.averageSalary || "0"),
            minSalary: estimate.minSalary,
            maxSalary: estimate.maxSalary,
        }));
    }
    // Get overall company rating
    static async getCompanyRating(companyId) {
        const result = await companyReview_repository_1.CompanyReviewRepository.getCompanyRating(companyId);
        if (!result) {
            throw new customError_1.CustomError("Company not found", 404);
        }
        return result;
    }
}
exports.ReviewQueryService = ReviewQueryService;
