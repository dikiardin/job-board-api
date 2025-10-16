"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionActivationService = void 0;
const subscription_repository_1 = require("../../repositories/subscription/subscription.repository");
const dateHelper_1 = require("../../utils/dateHelper");
const prisma_1 = require("../../generated/prisma");
class SubscriptionActivationService {
    static async activateSubscription(subscriptionId) {
        const paymentDate = new Date();
        const endDate = dateHelper_1.DateHelper.getSubscriptionEndDate(paymentDate);
        await subscription_repository_1.SubscriptionRepo.updateSubscription(subscriptionId, {
            status: prisma_1.SubscriptionStatus.ACTIVE,
            startDate: paymentDate,
            expiresAt: endDate,
        });
    }
    static calculateSubscriptionDates() {
        const paymentDate = new Date();
        const endDate = dateHelper_1.DateHelper.getSubscriptionEndDate(paymentDate);
        return { startDate: paymentDate, endDate };
    }
}
exports.SubscriptionActivationService = SubscriptionActivationService;
