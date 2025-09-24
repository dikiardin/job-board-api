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
    // All analytics endpoints are admin-only
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
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default AnalyticsRouter;
