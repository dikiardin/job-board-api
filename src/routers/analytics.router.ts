import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics/analytics.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyRole } from "../middlewares/verifyRole";
import { UserRole } from "../generated/prisma";

class AnalyticsRouter {
  private route: Router;

  constructor() {
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Platform-wide analytics endpoints (admin-only) - temporarily without auth for testing
    this.route.get(
      "/platform/demographics",
      AnalyticsController.platformDemographics
    );

    this.route.get(
      "/platform/salary-trends",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      AnalyticsController.platformSalaryTrends
    );

    this.route.get(
      "/platform/interests",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      AnalyticsController.platformInterests
    );

    this.route.get(
      "/platform/overview",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      AnalyticsController.platformOverview
    );

    // Legacy company-specific endpoints (for backward compatibility)
    this.route.get(
      "/companies/:companyId/analytics/demographics",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      AnalyticsController.demographics
    );

    this.route.get(
      "/companies/:companyId/analytics/salary-trends",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      AnalyticsController.salaryTrends
    );

    this.route.get(
      "/companies/:companyId/analytics/interests",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      AnalyticsController.interests
    );

    this.route.get(
      "/companies/:companyId/analytics/overview",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      AnalyticsController.overview
    );

    this.route.get(
      "/companies/:companyId/analytics/engagement",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      AnalyticsController.engagement
    );

    this.route.get(
      "/companies/:companyId/analytics/conversion-funnel",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      AnalyticsController.conversionFunnel
    );

    this.route.get(
      "/companies/:companyId/analytics/retention",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      AnalyticsController.retention
    );

    this.route.get(
      "/companies/:companyId/analytics/performance",
      verifyToken,
      verifyRole([UserRole.ADMIN]),
      AnalyticsController.performance
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default AnalyticsRouter;
