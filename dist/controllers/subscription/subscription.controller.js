"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const subscription_service_1 = require("../../services/subscription/subscription.service");
class SubscriptionController {
    static async getAllSubscriptions(req, res, next) {
        try {
            const subscriptions = await subscription_service_1.SubscriptionService.getAllSubscriptions();
            res.status(200).json(subscriptions);
        }
        catch (error) {
            next(error);
        }
    }
    static async getSubscriptionById(req, res, next) {
        try {
            const { id } = req.params;
            const subscription = await subscription_service_1.SubscriptionService.getSubscriptionById(parseInt(id));
            res.status(200).json(subscription);
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserSubscriptions(req, res, next) {
        try {
            const userId = parseInt(res.locals.decrypt.userId);
            const subscriptions = await subscription_service_1.SubscriptionService.getUserSubscriptions(userId);
            res.status(200).json(subscriptions);
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserActiveSubscription(req, res, next) {
        try {
            const userId = parseInt(res.locals.decrypt.userId);
            const subscription = await subscription_service_1.SubscriptionService.getUserActiveSubscription(userId);
            res.status(200).json(subscription);
        }
        catch (error) {
            next(error);
        }
    }
    static async subscribe(req, res, next) {
        try {
            const userId = parseInt(res.locals.decrypt.userId);
            const { planId } = req.body;
            if (!planId) {
                return res.status(400).json({ message: "Plan ID is required" });
            }
            const result = await subscription_service_1.SubscriptionService.subscribeUser(userId, parseInt(planId));
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateSubscription(req, res, next) {
        try {
            const { id } = req.params;
            const { isActive, startDate, endDate } = req.body;
            const updateData = {};
            if (isActive !== undefined)
                updateData.isActive = isActive;
            if (startDate)
                updateData.startDate = new Date(startDate);
            if (endDate)
                updateData.endDate = new Date(endDate);
            const subscription = await subscription_service_1.SubscriptionService.updateSubscription(parseInt(id), updateData);
            res.status(200).json(subscription);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SubscriptionController = SubscriptionController;
//# sourceMappingURL=subscription.controller.js.map