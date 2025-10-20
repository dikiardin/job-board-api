"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = require("../../services/analytics/analytics.service");
const prisma_1 = require("../../generated/prisma");
class AnalyticsController {
    static async demographics(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const requester = res.locals.decrypt;
            const data = await analytics_service_1.AnalyticsService.demographics({
                companyId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                query: req.query,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async salaryTrends(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const requester = res.locals.decrypt;
            const data = await analytics_service_1.AnalyticsService.salaryTrends({
                companyId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                query: req.query,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async interests(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const requester = res.locals.decrypt;
            const data = await analytics_service_1.AnalyticsService.interests({
                companyId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                query: req.query,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async overview(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const requester = res.locals.decrypt;
            const data = await analytics_service_1.AnalyticsService.overview({
                companyId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                query: req.query,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async engagement(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const requester = res.locals.decrypt;
            const data = await analytics_service_1.AnalyticsService.engagement({
                companyId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                query: req.query,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async conversionFunnel(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const requester = res.locals.decrypt;
            const data = await analytics_service_1.AnalyticsService.conversionFunnel({
                companyId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                query: req.query,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async retention(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const requester = res.locals.decrypt;
            const data = await analytics_service_1.AnalyticsService.retention({
                companyId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                query: req.query,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async performance(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const requester = res.locals.decrypt;
            const data = await analytics_service_1.AnalyticsService.performance({
                companyId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                query: req.query,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    // Platform-wide analytics controllers (no companyId needed)
    static async platformDemographics(req, res, next) {
        try {
            // Temporarily bypass authentication for testing
            const data = await analytics_service_1.AnalyticsService.demographics({
                companyId: 0, // Not used for platform-wide
                requesterId: 1, // Dummy admin ID
                requesterRole: prisma_1.UserRole.ADMIN,
                query: req.query,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            console.error('Platform demographics error:', error);
            next(error);
        }
    }
    static async platformSalaryTrends(req, res, next) {
        try {
            const requester = res.locals.decrypt;
            const data = await analytics_service_1.AnalyticsService.salaryTrends({
                companyId: 0, // Not used for platform-wide
                requesterId: requester.userId,
                requesterRole: requester.role,
                query: req.query,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async platformInterests(req, res, next) {
        try {
            const requester = res.locals.decrypt;
            const data = await analytics_service_1.AnalyticsService.interests({
                companyId: 0, // Not used for platform-wide
                requesterId: requester.userId,
                requesterRole: requester.role,
                query: req.query,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async platformOverview(req, res, next) {
        try {
            const requester = res.locals.decrypt;
            const data = await analytics_service_1.AnalyticsService.overview({
                companyId: 0, // Not used for platform-wide
                requesterId: requester.userId,
                requesterRole: requester.role,
                query: req.query,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AnalyticsController = AnalyticsController;
