"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const subscriptionManagement_service_1 = require("./subscriptionManagement.service");
const paymentManagement_service_1 = require("./paymentManagement.service");
class SubscriptionService {
    static async getAllSubscriptions() {
        return await subscriptionManagement_service_1.SubscriptionManagementService.getAllSubscriptions();
    }
    static async getSubscriptionById(id) {
        return await subscriptionManagement_service_1.SubscriptionManagementService.getSubscriptionById(id);
    }
    static async getUserSubscriptions(userId) {
        return await subscriptionManagement_service_1.SubscriptionManagementService.getUserSubscriptions(userId);
    }
    static async getUserActiveSubscription(userId) {
        return await subscriptionManagement_service_1.SubscriptionManagementService.getUserActiveSubscription(userId);
    }
    static async subscribeUser(userId, planId) {
        // Validate plan and check active subscription
        const plan = await subscriptionManagement_service_1.SubscriptionManagementService.validatePlanExists(planId);
        await subscriptionManagement_service_1.SubscriptionManagementService.checkActiveSubscription(userId);
        // Create subscription and payment records
        const subscription = await this.createSubscriptionRecord(userId, planId);
        const payment = await this.createPaymentForSubscription(subscription.id, plan.priceIdr);
        return { subscription, payment };
    }
    static async createSubscriptionRecord(userId, planId) {
        return await subscriptionManagement_service_1.SubscriptionManagementService.createSubscription(userId, planId);
    }
    static async createPaymentForSubscription(subscriptionId, amount) {
        return await paymentManagement_service_1.PaymentManagementService.createPaymentRecord(subscriptionId, Number(amount));
    }
    static async updateSubscription(id, data) {
        return await subscriptionManagement_service_1.SubscriptionManagementService.updateSubscription(id, data);
    }
}
exports.SubscriptionService = SubscriptionService;
