"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const subscription_repository_1 = require("../repositories/subscription/subscription.repository");
const email_service_1 = require("../services/subscription/email.service");
class SubscriptionJobs {
    // Job to check subscriptions expiring in 5 minutes (for testing)
    static startExpirationReminderJob() {
        // Run every minute for testing (5 minutes before expiration)
        node_cron_1.default.schedule("* * * * *", async () => {
            console.log("Running subscription expiration reminder job...");
            try {
                // Find subscriptions expiring in 5 minutes (for testing)
                const expiringSubscriptions = await subscription_repository_1.SubscriptionRepo.getSubscriptionsExpiringInMinutes(5);
                // Send email for each expiring subscription
                for (const subscription of expiringSubscriptions) {
                    await email_service_1.EmailService.sendSubscriptionExpirationEmail(subscription.user.email, subscription.user.name, subscription.plan.planName, subscription.endDate);
                }
                console.log(`Sent ${expiringSubscriptions.length} expiration reminder emails`);
            }
            catch (error) {
                console.error("Error in expiration reminder job:", error);
            }
        });
    }
    // Job to deactivate expired subscriptions
    static startExpirationJob() {
        // Run every minute for testing
        node_cron_1.default.schedule("* * * * *", async () => {
            console.log("Running subscription expiration job...");
            try {
                // Find expired subscriptions
                const expiredSubscriptions = await subscription_repository_1.SubscriptionRepo.getExpiredSubscriptions();
                // Deactivate expired subscriptions
                for (const subscription of expiredSubscriptions) {
                    await subscription_repository_1.SubscriptionRepo.updateSubscription(subscription.id, {
                        isActive: false,
                    });
                }
                console.log(`Deactivated ${expiredSubscriptions.length} expired subscriptions`);
            }
            catch (error) {
                console.error("Error in expiration job:", error);
            }
        });
    }
    // Start all jobs
    static startAllJobs() {
        this.startExpirationReminderJob();
        this.startExpirationJob();
        console.log("All subscription jobs started");
    }
}
exports.SubscriptionJobs = SubscriptionJobs;
//# sourceMappingURL=subscriptionJobs.js.map