"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("../controllers/analytics/analytics.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const verifyRole_1 = require("../middlewares/verifyRole");
const prisma_1 = require("../generated/prisma");
class AnalyticsRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Platform-wide analytics endpoints (admin-only) - temporarily without auth for testing
        this.route.get("/platform/demographics", analytics_controller_1.AnalyticsController.platformDemographics);
        this.route.get("/platform/salary-trends", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), analytics_controller_1.AnalyticsController.platformSalaryTrends);
        this.route.get("/platform/interests", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), analytics_controller_1.AnalyticsController.platformInterests);
        this.route.get("/platform/overview", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), analytics_controller_1.AnalyticsController.platformOverview);
        // Legacy company-specific endpoints (for backward compatibility)
        this.route.get("/companies/:companyId/analytics/demographics", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), analytics_controller_1.AnalyticsController.demographics);
        this.route.get("/companies/:companyId/analytics/salary-trends", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), analytics_controller_1.AnalyticsController.salaryTrends);
        this.route.get("/companies/:companyId/analytics/interests", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), analytics_controller_1.AnalyticsController.interests);
        this.route.get("/companies/:companyId/analytics/overview", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), analytics_controller_1.AnalyticsController.overview);
        this.route.get("/companies/:companyId/analytics/engagement", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), analytics_controller_1.AnalyticsController.engagement);
        this.route.get("/companies/:companyId/analytics/conversion-funnel", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), analytics_controller_1.AnalyticsController.conversionFunnel);
        this.route.get("/companies/:companyId/analytics/retention", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), analytics_controller_1.AnalyticsController.retention);
        this.route.get("/companies/:companyId/analytics/performance", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.ADMIN]), analytics_controller_1.AnalyticsController.performance);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = AnalyticsRouter;
