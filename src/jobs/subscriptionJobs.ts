import cron from "node-cron";
import { SubscriptionRepo } from "../repositories/subscription/subscription.repository";
import { EmailService } from "../services/subscription/email.service";

export function startSubscriptionJobs() {
  // Job to check subscriptions expiring in 24 hours (daily at 9 AM)
  cron.schedule("0 9 * * *", async () => {
    console.log("[CRON] Checking subscriptions expiring in 24 hours...");
    try {
      // Find subscriptions expiring in 24 hours
      const expiringSubscriptions =
        await SubscriptionRepo.getSubscriptionsExpiringInMinutes(24 * 60);

      // Send email for each expiring subscription
      for (const subscription of expiringSubscriptions) {
        await EmailService.sendSubscriptionExpirationEmail(
          subscription.user.email,
          subscription.user.name,
          subscription.plan.planName,
          subscription.endDate
        );
      }

      console.log(
        `[CRON] Sent ${expiringSubscriptions.length} expiration reminder emails (24 hours before expiry)`
      );
    } catch (error) {
      console.error("[CRON] Failed to send expiration reminders:", error);
    }
  });

  // Job to deactivate expired subscriptions (daily at 10 AM)
  cron.schedule("0 10 * * *", async () => {
    console.log("[CRON] Checking for expired subscriptions...");
    try {
      // Find expired subscriptions
      const expiredSubscriptions =
        await SubscriptionRepo.getExpiredSubscriptions();

      // Deactivate expired subscriptions
      for (const subscription of expiredSubscriptions) {
        await SubscriptionRepo.updateSubscription(subscription.id, {
          isActive: false,
        });
      }

      console.log(
        `[CRON] Deactivated ${expiredSubscriptions.length} expired subscriptions`
      );
    } catch (error) {
      console.error(
        "[CRON] Failed to deactivate expired subscriptions:",
        error
      );
    }
  });

  console.log("[CRON] All subscription jobs started");
}
