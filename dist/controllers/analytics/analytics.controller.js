"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = require("../../services/analytics/analytics.service");
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
}
exports.AnalyticsController = AnalyticsController;
