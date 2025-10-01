"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyReview_controller_1 = require("../controllers/companyReview/companyReview.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const companyReview_validator_1 = require("../middlewares/validator/companyReview.validator");
class CompanyReviewRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Get company reviews (public - anyone can see reviews)
        this.route.get("/companies/:companyId/reviews", companyReview_validator_1.validateGetReviews, companyReview_controller_1.CompanyReviewController.getCompanyReviews);
        // Get company review statistics (public)
        this.route.get("/companies/:companyId/reviews/stats", companyReview_controller_1.CompanyReviewController.getCompanyReviewStats);
        // Create review (authenticated users only - must be verified employee)
        this.route.post("/companies/:companyId/reviews", verifyToken_1.verifyToken, companyReview_validator_1.validateCreateReview, companyReview_controller_1.CompanyReviewController.createReview);
        // Check if user can review company (authenticated users only)
        this.route.get("/companies/:companyId/reviews/eligibility", verifyToken_1.verifyToken, companyReview_controller_1.CompanyReviewController.checkReviewEligibility);
        // Get user's own review for a company (authenticated users only)
        this.route.get("/companies/:companyId/reviews/my-review", verifyToken_1.verifyToken, companyReview_controller_1.CompanyReviewController.getUserReview);
        // Update user's review (authenticated users only)
        this.route.put("/companies/:companyId/reviews/my-review", verifyToken_1.verifyToken, companyReview_validator_1.validateCreateReview, companyReview_controller_1.CompanyReviewController.updateReview);
        // Delete user's review (authenticated users only)
        this.route.delete("/companies/:companyId/reviews/my-review", verifyToken_1.verifyToken, companyReview_controller_1.CompanyReviewController.deleteReview);
        // Get salary estimates by position for a company (public)
        this.route.get("/companies/:companyId/salary-estimates", companyReview_controller_1.CompanyReviewController.getSalaryEstimates);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = CompanyReviewRouter;
//# sourceMappingURL=companyReview.router.js.map