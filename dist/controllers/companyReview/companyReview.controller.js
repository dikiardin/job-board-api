"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyReviewController = void 0;
const companyReview_service_1 = require("../../services/companyReview/companyReview.service");
const ControllerHelper_1 = require("./helpers/ControllerHelper");
class CompanyReviewController {
    // Get all reviews for a company (public)
    static async getCompanyReviews(req, res, next) {
        try {
            const companyId = ControllerHelper_1.ControllerHelper.getCompanyId(req);
            const paginationParams = ControllerHelper_1.ControllerHelper.getPaginationParams(req);
            const result = await companyReview_service_1.CompanyReviewService.getCompanyReviews({
                companyId,
                ...paginationParams
            });
            ControllerHelper_1.ControllerHelper.sendSuccessResponse(res, "Company reviews retrieved successfully", result);
        }
        catch (error) {
            next(error);
        }
    }
    // Get company review statistics (public)
    static async getCompanyReviewStats(req, res, next) {
        try {
            const companyId = ControllerHelper_1.ControllerHelper.getCompanyId(req);
            const stats = await companyReview_service_1.CompanyReviewService.getCompanyReviewStats(companyId);
            ControllerHelper_1.ControllerHelper.sendSuccessResponse(res, "Company review statistics retrieved successfully", stats);
        }
        catch (error) {
            next(error);
        }
    }
    // Create a new review (authenticated)
    static async createReview(req, res, next) {
        try {
            const userId = ControllerHelper_1.ControllerHelper.getUserId(res);
            const companyId = ControllerHelper_1.ControllerHelper.getCompanyId(req);
            const reviewData = req.body;
            const review = await companyReview_service_1.CompanyReviewService.createReview({
                userId,
                companyId,
                ...reviewData
            });
            ControllerHelper_1.ControllerHelper.sendSuccessResponse(res, "Review created successfully", review, 201);
        }
        catch (error) {
            next(error);
        }
    }
    // Check if user can review company (authenticated)
    static async checkReviewEligibility(req, res, next) {
        try {
            const userId = ControllerHelper_1.ControllerHelper.getUserId(res);
            const companyId = ControllerHelper_1.ControllerHelper.getCompanyId(req);
            const eligibility = await companyReview_service_1.CompanyReviewService.checkReviewEligibility(userId, companyId);
            ControllerHelper_1.ControllerHelper.sendSuccessResponse(res, "Review eligibility checked successfully", eligibility);
        }
        catch (error) {
            next(error);
        }
    }
    // Get user's own review for a company (authenticated)
    static async getUserReview(req, res, next) {
        try {
            const userId = ControllerHelper_1.ControllerHelper.getUserId(res);
            const companyId = ControllerHelper_1.ControllerHelper.getCompanyId(req);
            const review = await companyReview_service_1.CompanyReviewService.getUserReview(userId, companyId);
            ControllerHelper_1.ControllerHelper.sendSuccessResponse(res, "User review retrieved successfully", review);
        }
        catch (error) {
            next(error);
        }
    }
    // Update user's review (authenticated)
    static async updateReview(req, res, next) {
        try {
            const userId = ControllerHelper_1.ControllerHelper.getUserId(res);
            const companyId = ControllerHelper_1.ControllerHelper.getCompanyId(req);
            const reviewData = req.body;
            const review = await companyReview_service_1.CompanyReviewService.updateReview({
                userId,
                companyId,
                ...reviewData
            });
            ControllerHelper_1.ControllerHelper.sendSuccessResponse(res, "Review updated successfully", review);
        }
        catch (error) {
            next(error);
        }
    }
    // Delete user's review (authenticated)
    static async deleteReview(req, res, next) {
        try {
            const userId = ControllerHelper_1.ControllerHelper.getUserId(res);
            const companyId = ControllerHelper_1.ControllerHelper.getCompanyId(req);
            await companyReview_service_1.CompanyReviewService.deleteReview(userId, companyId);
            ControllerHelper_1.ControllerHelper.sendDeleteResponse(res, "Review deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
    // Get salary estimates by position for a company (public)
    static async getSalaryEstimates(req, res, next) {
        try {
            const companyId = ControllerHelper_1.ControllerHelper.getCompanyId(req);
            const salaryEstimates = await companyReview_service_1.CompanyReviewService.getSalaryEstimates(companyId);
            ControllerHelper_1.ControllerHelper.sendSuccessResponse(res, "Salary estimates retrieved successfully", salaryEstimates);
        }
        catch (error) {
            next(error);
        }
    }
    // Get overall company rating
    static async getCompanyRating(req, res, next) {
        try {
            const companyId = ControllerHelper_1.ControllerHelper.getCompanyId(req);
            const companyRating = await companyReview_service_1.CompanyReviewService.getCompanyRating(companyId);
            ControllerHelper_1.ControllerHelper.sendSuccessResponse(res, "Company rating retrieved successfully", companyRating);
        }
        catch (error) {
            next(error);
        }
    }
    // Get company reviewers (authenticated users only - shows who reviewed)
    static async getCompanyReviewers(req, res, next) {
        try {
            const companyId = ControllerHelper_1.ControllerHelper.getCompanyId(req);
            const reviewers = await companyReview_service_1.CompanyReviewService.getCompanyReviewers(companyId);
            ControllerHelper_1.ControllerHelper.sendSuccessResponse(res, "Company reviewers retrieved successfully", reviewers);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CompanyReviewController = CompanyReviewController;
