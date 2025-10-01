"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyReviewController = void 0;
const companyReview_service_1 = require("../../services/companyReview/companyReview.service");
const customError_1 = require("../../utils/customError");
class CompanyReviewController {
    // Get all reviews for a company (public)
    static async getCompanyReviews(req, res, next) {
        try {
            const companyId = parseInt(req.params.companyId || '0');
            const page = parseInt(req.query.page || '1');
            const limit = parseInt(req.query.limit || '10');
            const sortBy = req.query.sortBy || 'createdAt';
            const sortOrder = req.query.sortOrder || 'desc';
            if (isNaN(companyId)) {
                throw new customError_1.CustomError("Invalid company ID", 400);
            }
            const result = await companyReview_service_1.CompanyReviewService.getCompanyReviews({
                companyId,
                page,
                limit,
                sortBy,
                sortOrder
            });
            res.status(200).json({
                success: true,
                message: "Company reviews retrieved successfully",
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get company review statistics (public)
    static async getCompanyReviewStats(req, res, next) {
        try {
            const companyId = parseInt(req.params.companyId || '0');
            if (isNaN(companyId)) {
                throw new customError_1.CustomError("Invalid company ID", 400);
            }
            const stats = await companyReview_service_1.CompanyReviewService.getCompanyReviewStats(companyId);
            res.status(200).json({
                success: true,
                message: "Company review statistics retrieved successfully",
                data: stats
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Create a new review (authenticated)
    static async createReview(req, res, next) {
        try {
            const userId = res.locals.decrypt.userId;
            const companyId = parseInt(req.params.companyId || '0');
            const reviewData = req.body;
            if (isNaN(companyId)) {
                throw new customError_1.CustomError("Invalid company ID", 400);
            }
            const review = await companyReview_service_1.CompanyReviewService.createReview({
                userId,
                companyId,
                ...reviewData
            });
            res.status(201).json({
                success: true,
                message: "Review created successfully",
                data: review
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Check if user can review company (authenticated)
    static async checkReviewEligibility(req, res, next) {
        try {
            const userId = res.locals.decrypt.userId;
            const companyId = parseInt(req.params.companyId || '0');
            if (isNaN(companyId)) {
                throw new customError_1.CustomError("Invalid company ID", 400);
            }
            const eligibility = await companyReview_service_1.CompanyReviewService.checkReviewEligibility(userId, companyId);
            res.status(200).json({
                success: true,
                message: "Review eligibility checked successfully",
                data: eligibility
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get user's own review for a company (authenticated)
    static async getUserReview(req, res, next) {
        try {
            const userId = res.locals.decrypt.userId;
            const companyId = parseInt(req.params.companyId || '0');
            if (isNaN(companyId)) {
                throw new customError_1.CustomError("Invalid company ID", 400);
            }
            const review = await companyReview_service_1.CompanyReviewService.getUserReview(userId, companyId);
            res.status(200).json({
                success: true,
                message: "User review retrieved successfully",
                data: review
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Update user's review (authenticated)
    static async updateReview(req, res, next) {
        try {
            const userId = res.locals.decrypt.userId;
            const companyId = parseInt(req.params.companyId || '0');
            const reviewData = req.body;
            if (isNaN(companyId)) {
                throw new customError_1.CustomError("Invalid company ID", 400);
            }
            const review = await companyReview_service_1.CompanyReviewService.updateReview({
                userId,
                companyId,
                ...reviewData
            });
            res.status(200).json({
                success: true,
                message: "Review updated successfully",
                data: review
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Delete user's review (authenticated)
    static async deleteReview(req, res, next) {
        try {
            const userId = res.locals.decrypt.userId;
            const companyId = parseInt(req.params.companyId || '0');
            if (isNaN(companyId)) {
                throw new customError_1.CustomError("Invalid company ID", 400);
            }
            await companyReview_service_1.CompanyReviewService.deleteReview(userId, companyId);
            res.status(200).json({
                success: true,
                message: "Review deleted successfully"
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get salary estimates by position for a company (public)
    static async getSalaryEstimates(req, res, next) {
        try {
            const companyId = parseInt(req.params.companyId || '0');
            if (isNaN(companyId)) {
                throw new customError_1.CustomError("Invalid company ID", 400);
            }
            const salaryEstimates = await companyReview_service_1.CompanyReviewService.getSalaryEstimates(companyId);
            res.status(200).json({
                success: true,
                message: "Salary estimates retrieved successfully",
                data: salaryEstimates
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CompanyReviewController = CompanyReviewController;
//# sourceMappingURL=companyReview.controller.js.map