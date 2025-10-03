import cron from "node-cron";
import { SubscriptionRepo } from "../repositories/subscription/subscription.repository";
import { EmailService } from "../services/subscription/email.service";
import { SubscriptionStatus } from "../generated/prisma";

export function startSubscriptionJobs() {
  // Reminder H-24 (daily at 09:00)
  cron.schedule("0 9 * * *", async () => {
    console.log("[CRON] Checking subscriptions expiring in 24 hours...");
    try {
      const expiring = await SubscriptionRepo.getSubscriptionsExpiringWithinHours(24);

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

      console.log(`[CRON] Sent ${expiring.length} expiration reminder emails (H-24)`);
    } catch (error) {
      console.error("[CRON] Failed to send expiration reminders:", error);
    }
  });

  // Deactivate expired subscriptions (daily at 10:00)
  cron.schedule("0 10 * * *", async () => {
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

