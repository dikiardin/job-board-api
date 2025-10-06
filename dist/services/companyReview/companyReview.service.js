"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyReviewService = void 0;
const ReviewQueryService_1 = require("./ReviewQueryService");
const ReviewManagementService_1 = require("./ReviewManagementService");
const EligibilityService_1 = require("./helpers/EligibilityService");
class CompanyReviewService {
    // Get all reviews for a company with pagination
    static async getCompanyReviews(params) {
        return await ReviewQueryService_1.ReviewQueryService.getCompanyReviews(params);
    }
    // Get company review statistics
    static async getCompanyReviewStats(companyId) {
        return await ReviewQueryService_1.ReviewQueryService.getCompanyReviewStats(companyId);
    }
    // Get company reviewers (shows who reviewed the company)
    static async getCompanyReviewers(companyId) {
        return await ReviewQueryService_1.ReviewQueryService.getCompanyReviewers(companyId);
    }
    // Create a new review
    static async createReview(data) {
        return await ReviewManagementService_1.ReviewManagementService.createReview(data);
    }
    // Check if user can review a company
    static async checkReviewEligibility(userId, companyId) {
        return await EligibilityService_1.EligibilityService.checkUserEligibility(userId, companyId);
    }
    // Get user's own review for a company
    static async getUserReview(userId, companyId) {
        return await ReviewManagementService_1.ReviewManagementService.getUserReview(userId, companyId);
    }
    // Update user's review
    static async updateReview(data) {
        return await ReviewManagementService_1.ReviewManagementService.updateReview(data);
    }
    // Delete user's review
    static async deleteReview(userId, companyId) {
        return await ReviewManagementService_1.ReviewManagementService.deleteReview(userId, companyId);
    }
    // Get salary estimates by position for a company
    static async getSalaryEstimates(companyId) {
        return await ReviewQueryService_1.ReviewQueryService.getSalaryEstimates(companyId);
    }
    // Get overall company rating
    static async getCompanyRating(companyId) {
        return await ReviewQueryService_1.ReviewQueryService.getCompanyRating(companyId);
    }
}
exports.CompanyReviewService = CompanyReviewService;
//# sourceMappingURL=companyReview.service.js.map