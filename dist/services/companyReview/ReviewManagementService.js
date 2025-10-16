"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewManagementService = void 0;
const companyReview_repository_1 = require("../../repositories/companyReview/companyReview.repository");
const CompanyValidationService_1 = require("./helpers/CompanyValidationService");
const ReviewValidationService_1 = require("./helpers/ReviewValidationService");
const EligibilityService_1 = require("./helpers/EligibilityService");
const customError_1 = require("../../utils/customError");
class ReviewManagementService {
    // Create a new review
    static async createReview(data) {
        const { userId, companyId } = data;
        // Check eligibility
        const eligibility = await EligibilityService_1.EligibilityService.checkUserEligibility(userId, companyId);
        if (!eligibility.canReview) {
            throw new customError_1.CustomError(eligibility.message || "Not eligible to review this company", 403);
        }
        // Validate rating values
        const ratings = [
            data.ratingCulture,
            data.ratingWorkLife,
            data.ratingFacilities,
            data.ratingCareer,
        ];
        ReviewValidationService_1.ReviewValidationService.validateRatingValues(ratings);
        // Build review data
        const reviewData = ReviewValidationService_1.ReviewValidationService.buildReviewData(data, eligibility);
        // Create the review
        const review = await companyReview_repository_1.CompanyReviewRepository.createReview(reviewData);
        return review;
    }
    // Get user's own review for a company
    static async getUserReview(userId, companyId) {
        await CompanyValidationService_1.CompanyValidationService.validateUserEmployment(userId, companyId);
        const review = await CompanyValidationService_1.CompanyValidationService.validateExistingReview(userId, companyId);
        return review;
    }
    // Update user's review
    static async updateReview(data) {
        const { userId, companyId } = data;
        await CompanyValidationService_1.CompanyValidationService.validateUserEmployment(userId, companyId);
        const existingReview = await CompanyValidationService_1.CompanyValidationService.validateExistingReview(userId, companyId);
        this.validateUpdateData(data);
        const updateData = this.buildUpdateData(data);
        const updatedReview = await companyReview_repository_1.CompanyReviewRepository.updateReview(existingReview.id, updateData);
        return updatedReview;
    }
    // Helper: Validate update data
    static validateUpdateData(data) {
        const ratings = [
            data.ratingCulture,
            data.ratingWorkLife,
            data.ratingFacilities,
            data.ratingCareer,
        ];
        ReviewValidationService_1.ReviewValidationService.validateRatingValues(ratings);
    }
    // Helper: Build update data object
    static buildUpdateData(data) {
        const companyRating = ReviewValidationService_1.ReviewValidationService.calculateCompanyRating(data.ratingCulture, data.ratingWorkLife, data.ratingFacilities, data.ratingCareer);
        const updateData = {
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
        return updateData;
    }
    // Delete user's review
    static async deleteReview(userId, companyId) {
        await CompanyValidationService_1.CompanyValidationService.validateUserEmployment(userId, companyId);
        const existingReview = await CompanyValidationService_1.CompanyValidationService.validateExistingReview(userId, companyId);
        await companyReview_repository_1.CompanyReviewRepository.deleteReview(existingReview.id);
    }
}
exports.ReviewManagementService = ReviewManagementService;
