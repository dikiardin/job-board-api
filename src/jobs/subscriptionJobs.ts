import cron from "node-cron";
import { SubscriptionRepo } from "../repositories/subscription/subscription.repository";
import { EmailService } from "../services/subscription/email.service";
import { SubscriptionStatus } from "../generated/prisma";

export function startSubscriptionJobs() {
  // FOR TESTING: Reminder 1 minute before expiry (every 30 seconds)
  cron.schedule("*/30 * * * * *", async () => {
    console.log("[CRON] Checking subscriptions expiring in 1 minute...");
    try {
      const expiring = await SubscriptionRepo.getSubscriptionsExpiringInMinutes(1);

      for (const subscription of expiring) {
        if (subscription.expiresAt) {
        await EmailService.sendSubscriptionExpirationEmail(
          subscription.user.email,
          subscription.user.name ?? subscription.user.email,
          subscription.plan.name,
          subscription.expiresAt
        );
      }
      }

      console.log(`[CRON] Sent ${expiring.length} expiration reminder emails (1 minute before)`);
    } catch (error) {
      console.error("[CRON] Failed to send expiration reminders:", error);
    }
  });

  // FOR TESTING: Deactivate expired subscriptions (every minute)
  cron.schedule("0 * * * * *", async () => {
    console.log("[CRON] Checking for expired subscriptions...");
    try {
      const expired = await SubscriptionRepo.getExpiredSubscriptions();

      for (const subscription of expired) {
        await SubscriptionRepo.updateSubscription(subscription.id, {
          status: SubscriptionStatus.EXPIRED,
        });
      }

      console.log(`[CRON] Deactivated ${expired.length} expired subscriptions`);
    } catch (error) {
      console.error("[CRON] Failed to deactivate expired subscriptions:", error);
    }
  });

  console.log("[CRON] All subscription jobs started");
}

