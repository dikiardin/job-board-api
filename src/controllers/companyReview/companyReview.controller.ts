import { Request, Response, NextFunction } from "express";
import { CompanyReviewService } from "../../services/companyReview/companyReview.service";
import { CustomError } from "../../utils/customError";

export class CompanyReviewController {
  // Get all reviews for a company (public)
  public static async getCompanyReviews(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = (req.params.companyId as string);
      const page = parseInt((req.query.page as string) || '1');
      const limit = parseInt((req.query.limit as string) || '10');
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as string) || 'desc';

      const result = await CompanyReviewService.getCompanyReviews({
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
      const companyId = (req.params.companyId as string);

      const stats = await CompanyReviewService.getCompanyReviewStats(companyId);

      res.status(200).json({
        success: true,
        message: "Company review statistics retrieved successfully",
        data: stats
      });
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
      const userId = res.locals.decrypt.userId;
      const companyId = (req.params.companyId as string);
      const reviewData = req.body;

      const review = await CompanyReviewService.createReview({
        userId,
        companyId,
        ...reviewData
      });

      res.status(201).json({
        success: true,
        message: "Review created successfully",
        data: review
      });
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
      const userId = res.locals.decrypt.userId;
      const companyId = (req.params.companyId as string);
      const eligibility = await CompanyReviewService.checkReviewEligibility(
        userId,
        companyId
      );

      res.status(200).json({
        success: true,
        message: "Review eligibility checked successfully",
        data: eligibility
      });
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
      const userId = res.locals.decrypt.userId;
      const companyId = (req.params.companyId as string);
      const review = await CompanyReviewService.getUserReview(userId, companyId);

      res.status(200).json({
        success: true,
        message: "User review retrieved successfully",
        data: review
      });
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
      const userId = res.locals.decrypt.userId;
      const companyId = (req.params.companyId as string);
      const reviewData = req.body;
      const review = await CompanyReviewService.updateReview({
        userId,
        companyId,
        ...reviewData
      });

      res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: review
      });
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
      const userId = res.locals.decrypt.userId;
      const companyId = (req.params.companyId as string);
      await CompanyReviewService.deleteReview(userId, companyId);

      res.status(200).json({
        success: true,
        message: "Review deleted successfully"
      });
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
      const companyId = (req.params.companyId as string);
      const salaryEstimates = await CompanyReviewService.getSalaryEstimates(companyId);

      res.status(200).json({
        success: true,
        message: "Salary estimates retrieved successfully",
        data: salaryEstimates
      });
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
      const companyId = (req.params.companyId as string);
      const companyRating = await CompanyReviewService.getCompanyRating(companyId);

      res.status(200).json({
        success: true,
        message: "Company rating retrieved successfully",
        data: companyRating
      });
    } catch (error) {
      next(error);
    }
  }
}
