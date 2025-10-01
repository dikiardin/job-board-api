"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyReviewService = void 0;
const companyReview_repository_1 = require("../../repositories/companyReview/companyReview.repository");
const customError_1 = require("../../utils/customError");
class CompanyReviewService {
    // Get all reviews for a company with pagination
    static async getCompanyReviews(params) {
        const { companyId, page, limit, sortBy, sortOrder } = params;
        // Check if company exists
        const companyExists = await companyReview_repository_1.CompanyReviewRepository.checkCompanyExists(companyId);
        if (!companyExists) {
            throw new customError_1.CustomError("Company not found", 404);
        }
        const offset = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            companyReview_repository_1.CompanyReviewRepository.getCompanyReviews({
                companyId,
                limit,
                offset,
                sortBy,
                sortOrder
            }),
            companyReview_repository_1.CompanyReviewRepository.getCompanyReviewsCount(companyId)
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
    static async getCompanyReviewStats(companyId) {
        // Check if company exists
        const companyExists = await companyReview_repository_1.CompanyReviewRepository.checkCompanyExists(companyId);
        if (!companyExists) {
            throw new customError_1.CustomError("Company not found", 404);
        }
        const stats = await companyReview_repository_1.CompanyReviewRepository.getCompanyReviewStats(companyId);
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
    static async createReview(data) {
        const { userId, companyId } = data;
        // Check if user is eligible to review this company
        const eligibility = await this.checkReviewEligibility(userId, companyId);
        if (!eligibility.canReview) {
            throw new customError_1.CustomError(eligibility.reason || "Not eligible to review this company", 403);
        }
        // Validate rating values (1-5)
        const ratings = [data.cultureRating, data.worklifeRating, data.facilityRating, data.careerRating];
        for (const rating of ratings) {
            if (rating < 1 || rating > 5) {
                throw new customError_1.CustomError("Rating values must be between 1 and 5", 400);
            }
        }
        // Create the review
        const reviewData = {
            employmentId: eligibility.employmentId,
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
        const review = await companyReview_repository_1.CompanyReviewRepository.createReview(reviewData);
        return review;
    }
    // Check if user can review a company
    static async checkReviewEligibility(userId, companyId) {
        // Check if company exists
        const companyExists = await companyReview_repository_1.CompanyReviewRepository.checkCompanyExists(companyId);
        if (!companyExists) {
            return { canReview: false, reason: "Company not found" };
        }
        // Check if user has employment record with this company
        const employment = await companyReview_repository_1.CompanyReviewRepository.getUserEmployment(userId, companyId);
        if (!employment) {
            return { canReview: false, reason: "You must be an employee of this company to leave a review" };
        }
        // Check if user has already reviewed this company
        const existingReview = await companyReview_repository_1.CompanyReviewRepository.getExistingReview(employment.id);
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
    static async getUserReview(userId, companyId) {
        const employment = await companyReview_repository_1.CompanyReviewRepository.getUserEmployment(userId, companyId);
        if (!employment) {
            throw new customError_1.CustomError("Employment record not found", 404);
        }
        const review = await companyReview_repository_1.CompanyReviewRepository.getExistingReview(employment.id);
        if (!review) {
            throw new customError_1.CustomError("Review not found", 404);
        }
        return review;
    }
    // Update user's review
    static async updateReview(data) {
        const { userId, companyId } = data;
        const employment = await companyReview_repository_1.CompanyReviewRepository.getUserEmployment(userId, companyId);
        if (!employment) {
            throw new customError_1.CustomError("Employment record not found", 404);
        }
        const existingReview = await companyReview_repository_1.CompanyReviewRepository.getExistingReview(employment.id);
        if (!existingReview) {
            throw new customError_1.CustomError("Review not found", 404);
        }
        // Validate rating values (1-5)
        const ratings = [data.cultureRating, data.worklifeRating, data.facilityRating, data.careerRating];
        for (const rating of ratings) {
            if (rating < 1 || rating > 5) {
                throw new customError_1.CustomError("Rating values must be between 1 and 5", 400);
            }
        }
        const updateData = {
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
        const updatedReview = await companyReview_repository_1.CompanyReviewRepository.updateReview(existingReview.id, updateData);
        return updatedReview;
    }
    // Delete user's review
    static async deleteReview(userId, companyId) {
        const employment = await companyReview_repository_1.CompanyReviewRepository.getUserEmployment(userId, companyId);
        if (!employment) {
            throw new customError_1.CustomError("Employment record not found", 404);
        }
        const existingReview = await companyReview_repository_1.CompanyReviewRepository.getExistingReview(employment.id);
        if (!existingReview) {
            throw new customError_1.CustomError("Review not found", 404);
        }
        await companyReview_repository_1.CompanyReviewRepository.deleteReview(existingReview.id);
    }
    // Get salary estimates by position for a company
    static async getSalaryEstimates(companyId) {
        // Check if company exists
        const companyExists = await companyReview_repository_1.CompanyReviewRepository.checkCompanyExists(companyId);
        if (!companyExists) {
            throw new customError_1.CustomError("Company not found", 404);
        }
        const salaryEstimates = await companyReview_repository_1.CompanyReviewRepository.getSalaryEstimates(companyId);
        return salaryEstimates.map(estimate => ({
            position: estimate.position,
            count: estimate.count,
            averageSalary: parseFloat(estimate.averageSalary || '0'),
            minSalary: estimate.minSalary,
            maxSalary: estimate.maxSalary
        }));
    }
}
exports.CompanyReviewService = CompanyReviewService;
//# sourceMappingURL=companyReview.service.js.map