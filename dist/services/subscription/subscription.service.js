"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const subscription_repository_1 = require("../../repositories/subscription/subscription.repository");
const plan_repository_1 = require("../../repositories/subscription/plan.repository");
const payment_repository_1 = require("../../repositories/subscription/payment.repository");
const customError_1 = require("../../utils/customError");
class SubscriptionService {
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
    static async subscribeUser(userId, planId) {
        // Check if plan exists
        const plan = await plan_repository_1.PlanRepo.getPlanById(planId);
        if (!plan) {
            throw new customError_1.CustomError("Subscription plan not found", 404);
        }
        // Check if user already has active subscription
        const activeSubscription = await subscription_repository_1.SubscriptionRepo.getUserActiveSubscription(userId);
        if (activeSubscription) {
            throw new customError_1.CustomError("User already has an active subscription", 400);
        }
        // Set dates to a far future date initially (will be updated when payment approved)
        const farFutureDate = new Date();
        farFutureDate.setMonth(farFutureDate.getMonth() + 1); // 1 month from now (placeholder)
        // Create subscription with placeholder dates
        const subscription = await subscription_repository_1.SubscriptionRepo.createSubscription({
            userId,
            subscriptionPlanId: planId,
            startDate: farFutureDate, // Placeholder - will be updated when payment approved
            endDate: farFutureDate, // Placeholder - will be updated when payment approved
        });
        // Create payment record
        const payment = await payment_repository_1.PaymentRepo.createPayment({
            subscriptionId: subscription.id,
            paymentMethod: "TRANSFER",
            amount: Number(plan.planPrice),
            expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        });
        return {
            subscription,
            payment,
        };
    }
    static async updateSubscription(id, data) {
        const existingSubscription = await subscription_repository_1.SubscriptionRepo.getSubscriptionById(id);
        if (!existingSubscription) {
            throw new customError_1.CustomError("Subscription not found", 404);
        }
        return await subscription_repository_1.SubscriptionRepo.updateSubscription(id, data);
    }
}
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=subscription.service.js.map