"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewStatsRepository = void 0;
const ReviewStatsQuery_repository_1 = require("./ReviewStatsQuery.repository");
const ReviewSalary_repository_1 = require("./ReviewSalary.repository");
class ReviewStatsRepository {
    // Get company review statistics
    static async getCompanyReviewStats(companyId) {
        return ReviewStatsQuery_repository_1.ReviewStatsQueryRepository.getCompanyReviewStats(companyId);
    }
    // Get overall company rating (average of all companyRating from reviews)
    static async getCompanyRating(companyId) {
        return ReviewStatsQuery_repository_1.ReviewStatsQueryRepository.getCompanyRating(companyId);
    }
    // Get salary estimates by position for a company
    static async getSalaryEstimates(companyId) {
        return ReviewSalary_repository_1.ReviewSalaryRepository.getSalaryEstimates(companyId);
    }
}
exports.ReviewStatsRepository = ReviewStatsRepository;
