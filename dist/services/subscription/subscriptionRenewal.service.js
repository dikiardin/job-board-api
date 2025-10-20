"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRenewalService = void 0;
const subscription_repository_1 = require("../../repositories/subscription/subscription.repository");
const prisma_1 = require("../../generated/prisma");
const customError_1 = require("../../utils/customError");
const renewalValidation_service_1 = require("./renewalValidation.service");
const renewalPayment_service_1 = require("./renewalPayment.service");
const renewalDate_service_1 = require("./renewalDate.service");
class SubscriptionRenewalService {
    static async renewSubscription(userId, planId) {
        console.log("=== RENEW SUBSCRIPTION START ===");
        console.log("User ID:", userId);
        console.log("Plan ID:", planId);
        try {
            const currentSubscription = await this.getCurrentSubscription(userId);
            console.log("Current subscription:", JSON.stringify(currentSubscription, null, 2));
            const targetPlanId = planId || currentSubscription.planId;
            console.log("Target plan ID:", targetPlanId);
            const plan = await renewalValidation_service_1.RenewalValidationService.validatePlan(targetPlanId);
            console.log("Plan validated:", plan.name);
            const renewalDates = renewalDate_service_1.RenewalDateService.calculateRenewalDates(currentSubscription);
            console.log("Renewal dates:", renewalDates);
            const newSubscription = await this.createRenewalSubscription(userId, targetPlanId, renewalDates);
            console.log("New subscription created:", newSubscription.id);
            const payment = await renewalPayment_service_1.RenewalPaymentService.createPayment(newSubscription.id, plan.priceIdr);
            console.log("Payment created:", payment.id);
            console.log("=== RENEW SUBSCRIPTION SUCCESS ===");
            return this.buildRenewalResponse(newSubscription, payment, plan);
        }
        catch (error) {
            console.error("=== RENEW SUBSCRIPTION ERROR ===");
            console.error("Error:", error);
            throw error;
        }
    }
    static async getRenewalInfo(userId) {
        try {
            console.log("=== RENEWAL INFO START ===");
            console.log("User ID:", userId);
            const currentSubscription = await this.getCurrentSubscription(userId);
            console.log("Current subscription found:", currentSubscription ? "YES" : "NO");
            console.log("Subscription details:", JSON.stringify(currentSubscription, null, 2));
            const plan = await renewalValidation_service_1.RenewalValidationService.validatePlan(currentSubscription.planId);
            console.log("Plan found:", plan ? "YES" : "NO");
            const pendingPayment = await this.getPendingRenewalPayment(userId);
            console.log("Pending payment found:", pendingPayment ? "YES" : "NO");
            const response = this.buildRenewalInfoResponse(currentSubscription, plan, pendingPayment);
            console.log("=== RENEWAL INFO SUCCESS ===");
            return response;
        }
        catch (error) {
            console.error("=== RENEWAL INFO ERROR ===");
            console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
            console.error("Error message:", error instanceof Error ? error.message : String(error));
            console.error("Error stack:", error instanceof Error ? error.stack : undefined);
            console.error("User ID:", userId);
            return this.buildErrorResponse();
        }
    }
    static async getCurrentSubscription(userId) {
        const subscription = await subscription_repository_1.SubscriptionRepo.getUserActiveSubscription(userId);
        if (!subscription) {
            const expiredSub = await this.getRecentExpiredSubscription(userId);
            if (expiredSub)
                return expiredSub;
            throw new customError_1.CustomError("No subscription found for renewal", 404);
        }
        return subscription;
    }
    static async getRecentExpiredSubscription(userId) {
        const subscriptions = await subscription_repository_1.SubscriptionRepo.getUserSubscriptions(userId);
        return subscriptions.find((sub) => sub.status === prisma_1.SubscriptionStatus.EXPIRED &&
            sub.expiresAt &&
            renewalDate_service_1.RenewalDateService.isWithinGracePeriod(new Date(sub.expiresAt)));
    }
    static async createRenewalSubscription(userId, planId, dates) {
        return await subscription_repository_1.SubscriptionRepo.createSubscription({
            userId,
            planId,
            status: prisma_1.SubscriptionStatus.PENDING,
            startDate: dates.startDate,
            expiresAt: dates.expiresAt,
        });
    }
    static async getPendingRenewalPayment(userId) {
        const userSubscriptions = await subscription_repository_1.SubscriptionRepo.getUserSubscriptions(userId);
        const subscriptionIds = userSubscriptions.map((sub) => sub.id);
        return await renewalPayment_service_1.RenewalPaymentService.getPendingPayment(userId, subscriptionIds);
    }
    static buildRenewalResponse(subscription, payment, plan) {
        return {
            subscription,
            payment,
            plan,
            message: "Renewal request created. Please upload payment proof to complete.",
        };
    }
    static buildRenewalInfoResponse(subscription, plan, pendingPayment) {
        return {
            currentSubscription: subscription,
            plan,
            canRenew: !pendingPayment,
            renewalPrice: plan?.priceIdr || 0,
            pendingPayment,
        };
    }
    static buildErrorResponse() {
        return {
            currentSubscription: null,
            plan: null,
            canRenew: false,
            renewalPrice: 0,
            message: "No active or recent subscription found",
        };
    }
}
exports.SubscriptionRenewalService = SubscriptionRenewalService;
