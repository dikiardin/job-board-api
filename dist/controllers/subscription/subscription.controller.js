"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const subscription_service_1 = require("../../services/subscription/subscription.service");
const subscriptionRenewal_service_1 = require("../../services/subscription/subscriptionRenewal.service");
const controllerHelper_1 = require("../../utils/controllerHelper");
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
            const id = controllerHelper_1.ControllerHelper.parseId(req.params.id);
            const subscription = await subscription_service_1.SubscriptionService.getSubscriptionById(id);
            res.status(200).json(subscription);
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserSubscriptions(req, res, next) {
        try {
            const userId = controllerHelper_1.ControllerHelper.getUserId(res);
            const subscriptions = await subscription_service_1.SubscriptionService.getUserSubscriptions(userId);
            res.status(200).json(subscriptions);
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserActiveSubscription(req, res, next) {
        try {
            const userId = controllerHelper_1.ControllerHelper.getUserId(res);
            const subscription = await subscription_service_1.SubscriptionService.getUserActiveSubscription(userId);
            res.status(200).json(subscription);
        }
        catch (error) {
            next(error);
        }
    }
    static async subscribe(req, res, next) {
        try {
            const userId = controllerHelper_1.ControllerHelper.getUserId(res);
            const { planId } = req.body;
            controllerHelper_1.ControllerHelper.validateRequired({ planId }, "Plan ID is required");
            // Ensure planId is integer
            const parsedPlanId = typeof planId === 'string' ? parseInt(planId) : planId;
            if (isNaN(parsedPlanId)) {
                throw new Error("Invalid plan ID format");
            }
            const result = await subscription_service_1.SubscriptionService.subscribeUser(userId, parsedPlanId);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateSubscription(req, res, next) {
        try {
            const id = controllerHelper_1.ControllerHelper.parseId(req.params.id);
            const updateData = controllerHelper_1.ControllerHelper.buildUpdateData(req.body, [
                'isActive', 'startDate', 'endDate'
            ]);
            const subscription = await subscription_service_1.SubscriptionService.updateSubscription(id, updateData);
            res.status(200).json(subscription);
        }
        catch (error) {
            next(error);
        }
    }
    static async renewSubscription(req, res, next) {
        try {
            const userId = controllerHelper_1.ControllerHelper.getUserId(res);
            const planId = req.body.planId ? controllerHelper_1.ControllerHelper.parseId(req.body.planId) : undefined;
            const result = await subscriptionRenewal_service_1.SubscriptionRenewalService.renewSubscription(userId, planId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async getRenewalInfo(req, res, next) {
        try {
            const userId = controllerHelper_1.ControllerHelper.getUserId(res);
            const renewalInfo = await subscriptionRenewal_service_1.SubscriptionRenewalService.getRenewalInfo(userId);
            res.status(200).json(renewalInfo);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SubscriptionController = SubscriptionController;
