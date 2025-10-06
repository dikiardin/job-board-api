import { Request, Response, NextFunction } from "express";
import { CompanyReviewService } from "../../services/companyReview/companyReview.service";
import { ControllerHelper } from "./helpers/ControllerHelper";

export class CompanyReviewController {
  // Get all reviews for a company (public)
  public static async getCompanyReviews(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = ControllerHelper.getCompanyId(req);
      const paginationParams = ControllerHelper.getPaginationParams(req);

      const result = await CompanyReviewService.getCompanyReviews({
        companyId,
        ...paginationParams
      });

      ControllerHelper.sendSuccessResponse(res, "Company reviews retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  // Get company review statistics (public)
  public static async getCompanyReviewStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = ControllerHelper.getCompanyId(req);
      const stats = await CompanyReviewService.getCompanyReviewStats(companyId);
      ControllerHelper.sendSuccessResponse(res, "Company review statistics retrieved successfully", stats);
    } catch (error) {
      next(error);
    }
  }

  // Create a new review (authenticated)
  public static async createReview(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = ControllerHelper.getUserId(res);
      const companyId = ControllerHelper.getCompanyId(req);
      const reviewData = req.body;

      const review = await CompanyReviewService.createReview({
        userId,
        companyId,
        ...reviewData
      });

      ControllerHelper.sendSuccessResponse(res, "Review created successfully", review, 201);
    } catch (error) {
      next(error);
    }
  }

  // Check if user can review company (authenticated)
  public static async checkReviewEligibility(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = ControllerHelper.getUserId(res);
      const companyId = ControllerHelper.getCompanyId(req);
      const eligibility = await CompanyReviewService.checkReviewEligibility(userId, companyId);
      ControllerHelper.sendSuccessResponse(res, "Review eligibility checked successfully", eligibility);
    } catch (error) {
      next(error);
    }
  }

  // Get user's own review for a company (authenticated)
  public static async getUserReview(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = ControllerHelper.getUserId(res);
      const companyId = ControllerHelper.getCompanyId(req);
      const review = await CompanyReviewService.getUserReview(userId, companyId);
      ControllerHelper.sendSuccessResponse(res, "User review retrieved successfully", review);
    } catch (error) {
      next(error);
    }
  }

  // Update user's review (authenticated)
  public static async updateReview(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = ControllerHelper.getUserId(res);
      const companyId = ControllerHelper.getCompanyId(req);
      const reviewData = req.body;
      const review = await CompanyReviewService.updateReview({
        userId,
        companyId,
        ...reviewData
      });
      ControllerHelper.sendSuccessResponse(res, "Review updated successfully", review);
    } catch (error) {
      next(error);
    }
  }

  // Delete user's review (authenticated)
  public static async deleteReview(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = ControllerHelper.getUserId(res);
      const companyId = ControllerHelper.getCompanyId(req);
      await CompanyReviewService.deleteReview(userId, companyId);
      ControllerHelper.sendDeleteResponse(res, "Review deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  // Get salary estimates by position for a company (public)
  public static async getSalaryEstimates(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = ControllerHelper.getCompanyId(req);
      const salaryEstimates = await CompanyReviewService.getSalaryEstimates(companyId);
      ControllerHelper.sendSuccessResponse(res, "Salary estimates retrieved successfully", salaryEstimates);
    } catch (error) {
      next(error);
    }
  }

  // Get overall company rating
  public static async getCompanyRating(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = ControllerHelper.getCompanyId(req);
      const companyRating = await CompanyReviewService.getCompanyRating(companyId);
      ControllerHelper.sendSuccessResponse(res, "Company rating retrieved successfully", companyRating);
    } catch (error) {
      next(error);
    }
  }

  // Get company reviewers (authenticated users only - shows who reviewed)
  public static async getCompanyReviewers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = ControllerHelper.getCompanyId(req);
      const reviewers = await CompanyReviewService.getCompanyReviewers(companyId);
      ControllerHelper.sendSuccessResponse(res, "Company reviewers retrieved successfully", reviewers);
    } catch (error) {
      next(error);
    }
  }
}
