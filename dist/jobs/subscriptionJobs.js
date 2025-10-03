"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSubscriptionJobs = startSubscriptionJobs;
const node_cron_1 = __importDefault(require("node-cron"));
const subscription_repository_1 = require("../repositories/subscription/subscription.repository");
const email_service_1 = require("../services/subscription/email.service");
const prisma_1 = require("../generated/prisma");
function startSubscriptionJobs() {
    // Reminder H-24 (daily at 09:00)
    node_cron_1.default.schedule("0 9 * * *", async () => {
        console.log("[CRON] Checking subscriptions expiring in 24 hours...");
        try {
            const expiring = await subscription_repository_1.SubscriptionRepo.getSubscriptionsExpiringWithinHours(24);
            for (const subscription of expiring) {
                await email_service_1.EmailService.sendSubscriptionExpirationEmail(subscription.user.email, subscription.user.name, subscription.plan.name, subscription.expiresAt);
            }
            console.log(`[CRON] Sent ${expiring.length} expiration reminder emails (H-24)`);
        }
        catch (error) {
            console.error("[CRON] Failed to send expiration reminders:", error);
        }
    });
    // Deactivate expired subscriptions (daily at 10:00)
    node_cron_1.default.schedule("0 10 * * *", async () => {
        console.log("[CRON] Checking for expired subscriptions...");
        try {
            const expired = await subscription_repository_1.SubscriptionRepo.getExpiredSubscriptions();
            for (const subscription of expired) {
                await subscription_repository_1.SubscriptionRepo.updateSubscription(subscription.id, {
                    status: prisma_1.SubscriptionStatus.EXPIRED,
                });
            }
            console.log(`[CRON] Deactivated ${expired.length} expired subscriptions`);
        }
        catch (error) {
            console.error("[CRON] Failed to deactivate expired subscriptions:", error);
        }
    });
    console.log("[CRON] All subscription jobs started");
}
//# sourceMappingURL=subscriptionJobs.js.map