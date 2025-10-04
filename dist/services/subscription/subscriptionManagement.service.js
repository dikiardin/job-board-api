"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionManagementService = void 0;
const subscription_repository_1 = require("../../repositories/subscription/subscription.repository");
const plan_repository_1 = require("../../repositories/subscription/plan.repository");
const customError_1 = require("../../utils/customError");
const dateHelper_1 = require("../../utils/dateHelper");
class SubscriptionManagementService {
    static async getAllSubscriptions() {
        return await subscription_repository_1.SubscriptionRepo.getAllSubscriptions();
    }
    static async getSubscriptionById(id) {
        const subscription = await subscription_repository_1.SubscriptionRepo.getSubscriptionById(id);
        if (!subscription) {
            throw new customError_1.CustomError("Subscription not found", 404);
        }
        return subscription;
    }
    static async getUserSubscriptions(userId) {
        return await subscription_repository_1.SubscriptionRepo.getUserSubscriptions(userId);
    }
    static async getUserActiveSubscription(userId) {
        return await subscription_repository_1.SubscriptionRepo.getUserActiveSubscription(userId);
    }
    static async validatePlanExists(planId) {
        const plan = await plan_repository_1.PlanRepo.getPlanById(planId);
        if (!plan) {
            throw new customError_1.CustomError("Subscription plan not found", 404);
        }
        return plan;
    }
    static async checkActiveSubscription(userId) {
        const activeSubscription = await subscription_repository_1.SubscriptionRepo.getUserActiveSubscription(userId);
        if (activeSubscription) {
            throw new customError_1.CustomError("User already has an active subscription", 400);
        }
    }
    static async createSubscription(userId, planId) {
        const placeholderDate = dateHelper_1.DateHelper.getPlaceholderDate();
        return await subscription_repository_1.SubscriptionRepo.createSubscription({
            userId,
            planId: planId,
            startDate: placeholderDate,
            expiresAt: placeholderDate,
        });
    }
    static async updateSubscription(id, data) {
        const existingSubscription = await subscription_repository_1.SubscriptionRepo.getSubscriptionById(id);
        if (!existingSubscription) {
            throw new customError_1.CustomError("Subscription not found", 404);
        }
        return await subscription_repository_1.SubscriptionRepo.updateSubscription(id, data);
    }
}
exports.SubscriptionManagementService = SubscriptionManagementService;
//# sourceMappingURL=subscriptionManagement.service.js.map