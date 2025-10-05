import { Router } from "express";
import { CompanyReviewController } from "../controllers/companyReview/companyReview.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { validateCreateReview, validateGetReviews } from "../middlewares/validator/companyReview.validator";

class CompanyReviewRouter {
  private route: Router;

  constructor() {
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Get company reviews (public - anyone can see reviews)
    this.route.get(
      "/companies/:companyId/reviews",
      validateGetReviews,
      CompanyReviewController.getCompanyReviews
    );

    // Get company review statistics (public)
    this.route.get(
      "/companies/:companyId/reviews/stats",
      CompanyReviewController.getCompanyReviewStats
    );

    // Create review (authenticated users only - must be verified employee)
    this.route.post(
      "/companies/:companyId/reviews",
      verifyToken,
      validateCreateReview,
      CompanyReviewController.createReview
    );

    // Check if user can review company (authenticated users only)
    this.route.get(
      "/companies/:companyId/reviews/eligibility",
      verifyToken,
      CompanyReviewController.checkReviewEligibility
    );

    // Get user's own review for a company (authenticated users only)
    this.route.get(
      "/companies/:companyId/reviews/my-review",
      verifyToken,
      CompanyReviewController.getUserReview
    );

    // Update user's review (authenticated users only)
    this.route.patch(
      "/companies/:companyId/reviews/my-review",
      verifyToken,
      validateCreateReview,
      CompanyReviewController.updateReview
    );

    // Delete user's review (authenticated users only)
    this.route.delete(
      "/companies/:companyId/reviews/my-review",
      verifyToken,
      CompanyReviewController.deleteReview
    );

    // Get salary estimates by position for a company (public)
    this.route.get(
      "/companies/:companyId/salary-estimates",
      CompanyReviewController.getSalaryEstimates
    );

    // Get overall company rating (public)
    this.route.get(
      "/companies/:companyId/rating",
      CompanyReviewController.getCompanyRating
    );

    // Get company reviewers list (authenticated users only - shows who reviewed)
    this.route.get(
      "/companies/:companyId/reviewers",
      verifyToken,
      CompanyReviewController.getCompanyReviewers
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default CompanyReviewRouter;
