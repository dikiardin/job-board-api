import cron from "node-cron";
import { SubscriptionRepo } from "../repositories/subscription/subscription.repository";
import { EmailService } from "../services/subscription/email.service";
import { SubscriptionStatus } from "../generated/prisma";

export function startSubscriptionJobs() {
  // Reminder 50 minutes before expiry (every 10 minutes)
  cron.schedule("*/10 * * * *", async () => {
    try {
      const expiring = await SubscriptionRepo.getSubscriptionsExpiringInMinutes(50);

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

    } catch (error) {
      console.error("[CRON] Failed to send expiration reminders:", error);
    }
  });

  // Deactivate expired subscriptions (every 15 minutes)
  cron.schedule("*/15 * * * *", async () => {
    try {
      const expired = await SubscriptionRepo.getExpiredSubscriptions();

      for (const subscription of expired) {
        await SubscriptionRepo.updateSubscription(subscription.id, {
          status: SubscriptionStatus.EXPIRED,
        });
      }

    } catch (error) {
      console.error("[CRON] Failed to deactivate expired subscriptions:", error);
    }
  });
}

