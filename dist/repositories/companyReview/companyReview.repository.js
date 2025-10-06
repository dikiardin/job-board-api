"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyReviewRepository = void 0;
const CompanyValidationRepository_1 = require("./CompanyValidationRepository");
const ReviewQueryRepository_1 = require("./ReviewQueryRepository");
const ReviewMutationRepository_1 = require("./ReviewMutationRepository");
const ReviewStatsRepository_1 = require("./ReviewStatsRepository");
class CompanyReviewRepository {
    // Company validation methods
    static async checkCompanyExists(companyId) {
        return await CompanyValidationRepository_1.CompanyValidationRepository.checkCompanyExists(companyId);
    }
    static async getUserEmployment(userId, companyId) {
        return await CompanyValidationRepository_1.CompanyValidationRepository.getUserEmployment(userId, companyId);
    }
    static async getUserVerifiedEmployment(userId, companyId) {
        return await CompanyValidationRepository_1.CompanyValidationRepository.getUserVerifiedEmployment(userId, companyId);
    }
    // Review query methods
    static async getExistingReview(employmentId) {
        return await ReviewQueryRepository_1.ReviewQueryRepository.getExistingReview(employmentId);
    }
    static async getExistingReviewByUserAndCompany(userId, companyId) {
        return await ReviewQueryRepository_1.ReviewQueryRepository.getExistingReviewByUserAndCompany(userId, companyId);
    }
    static async getCompanyReviews(params) {
        return await ReviewQueryRepository_1.ReviewQueryRepository.getCompanyReviews(params);
    }
    static async getCompanyReviewsCount(companyId) {
        return await ReviewQueryRepository_1.ReviewQueryRepository.getCompanyReviewsCount(companyId);
    }
    static async getCompanyReviewers(companyId) {
        return await ReviewQueryRepository_1.ReviewQueryRepository.getCompanyReviewers(companyId);
    }
    // Review mutation methods
    static async createReview(data) {
        return await ReviewMutationRepository_1.ReviewMutationRepository.createReview(data);
    }
    static async updateReview(reviewId, data) {
        return await ReviewMutationRepository_1.ReviewMutationRepository.updateReview(reviewId, data);
    }
    static async deleteReview(reviewId) {
        return await ReviewMutationRepository_1.ReviewMutationRepository.deleteReview(reviewId);
    }
    // Review statistics methods
    static async getCompanyReviewStats(companyId) {
        return await ReviewStatsRepository_1.ReviewStatsRepository.getCompanyReviewStats(companyId);
    }
    static async getCompanyRating(companyId) {
        return await ReviewStatsRepository_1.ReviewStatsRepository.getCompanyRating(companyId);
    }
    static async getSalaryEstimates(companyId) {
        return await ReviewStatsRepository_1.ReviewStatsRepository.getSalaryEstimates(companyId);
    }
}
exports.CompanyReviewRepository = CompanyReviewRepository;
//# sourceMappingURL=companyReview.repository.js.map