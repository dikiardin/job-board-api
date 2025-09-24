"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = require("../../services/analytics/analytics.service");
class AnalyticsController {
    static async demographics(req, res, next) {
        try {
            const companyId = Number(req.params.companyId);
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
            const companyId = Number(req.params.companyId);
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
            const companyId = Number(req.params.companyId);
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
            const companyId = Number(req.params.companyId);
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
}
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=analytics.controller.js.map