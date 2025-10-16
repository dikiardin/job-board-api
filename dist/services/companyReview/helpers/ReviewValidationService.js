"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidationService = void 0;
const customError_1 = require("../../../utils/customError");
class ReviewValidationService {
    static validateRatingValues(ratings) {
        for (const rating of ratings) {
            if (rating < 0.1 || rating > 5) {
                throw new customError_1.CustomError("Rating values must be between 0.1 and 5.0", 400);
            }
        }
    }
    static calculateCompanyRating(ratingCulture, ratingWorkLife, ratingFacilities, ratingCareer) {
        return (ratingCulture + ratingWorkLife + ratingFacilities + ratingCareer) / 4;
    }
    static buildReviewData(data, eligibility) {
        const reviewData = {
            companyId: parseInt(data.companyId),
            employmentId: eligibility.employmentId,
            reviewerUserId: data.userId,
            positionTitle: data.positionTitle,
            ratingCulture: data.ratingCulture,
            ratingWorkLife: data.ratingWorkLife,
            ratingFacilities: data.ratingFacilities,
            ratingCareer: data.ratingCareer,
            companyRating: this.calculateCompanyRating(data.ratingCulture, data.ratingWorkLife, data.ratingFacilities, data.ratingCareer),
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
        return reviewData;
    }
}
exports.ReviewValidationService = ReviewValidationService;
