"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRepo = void 0;
const subscriptionQuery_repository_1 = require("./subscriptionQuery.repository");
const subscriptionMutation_repository_1 = require("./subscriptionMutation.repository");
const subscriptionExpiry_repository_1 = require("./subscriptionExpiry.repository");
class SubscriptionRepo {
    // Query operations
    static async getAllSubscriptions() {
        return subscriptionQuery_repository_1.SubscriptionQueryRepo.getAllSubscriptions();
    }
    static async getSubscriptionById(id) {
        return subscriptionQuery_repository_1.SubscriptionQueryRepo.getSubscriptionById(id);
    }
    static async getUserSubscriptions(userId) {
        return subscriptionQuery_repository_1.SubscriptionQueryRepo.getUserSubscriptions(userId);
    }
    static async getUserActiveSubscription(userId) {
        return subscriptionQuery_repository_1.SubscriptionQueryRepo.getUserActiveSubscription(userId);
    }
    // Mutation operations
    static async createSubscription(data) {
        return subscriptionMutation_repository_1.SubscriptionMutationRepo.createSubscription(data);
    }
    static async updateSubscription(id, data) {
        return subscriptionMutation_repository_1.SubscriptionMutationRepo.updateSubscription(id, data);
    }
    // Expiry operations
    static async getSubscriptionsExpiringTomorrow() {
        return subscriptionExpiry_repository_1.SubscriptionExpiryRepo.getSubscriptionsExpiringTomorrow();
    }
    static async getSubscriptionsExpiringInMinutes(minutes) {
        return subscriptionExpiry_repository_1.SubscriptionExpiryRepo.getSubscriptionsExpiringInMinutes(minutes);
    }
    static async getExpiredSubscriptions() {
        return subscriptionExpiry_repository_1.SubscriptionExpiryRepo.getExpiredSubscriptions();
    }
}
exports.SubscriptionRepo = SubscriptionRepo;
//# sourceMappingURL=subscription.repository.js.map