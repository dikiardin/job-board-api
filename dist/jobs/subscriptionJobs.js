"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSubscriptionJobs = startSubscriptionJobs;
const node_cron_1 = __importDefault(require("node-cron"));
const subscription_repository_1 = require("../repositories/subscription/subscription.repository");
const email_service_1 = require("../services/subscription/email.service");
function startSubscriptionJobs() {
    // Job to check subscriptions expiring in 2 minutes (for testing)
    node_cron_1.default.schedule("* * * * *", async () => {
        console.log("[CRON] Checking subscriptions expiring in 2 minutes...");
        try {
            // Find subscriptions expiring in 2 minutes (for testing)
            const expiringSubscriptions = await subscription_repository_1.SubscriptionRepo.getSubscriptionsExpiringInMinutes(2);
            // Send email for each expiring subscription
            for (const subscription of expiringSubscriptions) {
                await email_service_1.EmailService.sendSubscriptionExpirationEmail(subscription.user.email, subscription.user.name, subscription.plan.planName, subscription.endDate);
            }
            console.log(`[CRON] Sent ${expiringSubscriptions.length} expiration reminder emails (2 minutes before expiry)`);
        }
        catch (error) {
            console.error("[CRON] Failed to send expiration reminders:", error);
        }
    });
    // Job to deactivate expired subscriptions
    node_cron_1.default.schedule("* * * * *", async () => {
        console.log("[CRON] Checking for expired subscriptions...");
        try {
            // Find expired subscriptions
            const expiredSubscriptions = await subscription_repository_1.SubscriptionRepo.getExpiredSubscriptions();
            // Deactivate expired subscriptions
            for (const subscription of expiredSubscriptions) {
                await subscription_repository_1.SubscriptionRepo.updateSubscription(subscription.id, {
                    isActive: false,
                });
            }
            console.log(`[CRON] Deactivated ${expiredSubscriptions.length} expired subscriptions`);
        }
        catch (error) {
            console.error("[CRON] Failed to deactivate expired subscriptions:", error);
        }
    });
    console.log("[CRON] All subscription jobs started");
}
//# sourceMappingURL=subscriptionJobs.js.map