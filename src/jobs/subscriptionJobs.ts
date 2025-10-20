import cron from "node-cron";
import { SubscriptionRepo } from "../repositories/subscription/subscription.repository";
import { EmailService } from "../services/subscription/email.service";
import { SubscriptionStatus } from "../generated/prisma";

// Simple in-memory deduplication for reminder emails to avoid duplicates
const sentReminderCache = new Map<number, number>();
const REMINDER_DEDUP_MS = 2 * 60 * 60 * 1000; // 2 hours window

export function startSubscriptionJobs() {
  // TESTING: Reminder 1 minute before expiry (runs every 1 minute)
  cron.schedule("* * * * *", async () => {
    try {
      const expiring =
        await SubscriptionRepo.getSubscriptionsExpiringInMinutesWindow(1, 60);

      for (const subscription of expiring) {
        if (subscription.expiresAt) {
          const lastSentAt = sentReminderCache.get(subscription.id);
          const now = Date.now();
          if (!lastSentAt || now - lastSentAt > REMINDER_DEDUP_MS) {
            await EmailService.sendSubscriptionExpirationEmail(
              subscription.user.email,
              subscription.user.name ?? subscription.user.email,
              subscription.plan.name,
              subscription.expiresAt
            );
            sentReminderCache.set(subscription.id, now);
          }
        }
      }
    } catch (error) {
      console.error("[CRON] Failed to send expiration reminders:", error);
    }
  });

  // TESTING: Deactivate expired subscriptions (runs every 1 minute)
  cron.schedule("* * * * *", async () => {
    try {
      const expired = await SubscriptionRepo.getExpiredSubscriptions();

      for (const subscription of expired) {
        await SubscriptionRepo.updateSubscription(subscription.id, {
          status: SubscriptionStatus.EXPIRED,
        });
      }
    } catch (error) {
      console.error(
        "[CRON] Failed to deactivate expired subscriptions:",
        error
      );
    }
  });
}

// Run one cycle of subscription jobs (idempotent)
export async function runSubscriptionCycle(): Promise<void> {
  try {
    // TESTING: Check for subscriptions expiring in 1 minute
    const expiring =
      await SubscriptionRepo.getSubscriptionsExpiringInMinutesWindow(1, 60);
    const now = Date.now();
    for (const subscription of expiring) {
      if (subscription.expiresAt) {
        const lastSentAt = sentReminderCache.get(subscription.id);
        if (!lastSentAt || now - lastSentAt > REMINDER_DEDUP_MS) {
          await EmailService.sendSubscriptionExpirationEmail(
            subscription.user.email,
            subscription.user.name ?? subscription.user.email,
            subscription.plan.name,
            subscription.expiresAt
          );
          sentReminderCache.set(subscription.id, now);
        }
      }
    }
  } catch (error) {
    console.error(
      "[CRON] Failed to send expiration reminders (one-off):",
      error
    );
  }

  try {
    const expired = await SubscriptionRepo.getExpiredSubscriptions();
    for (const subscription of expired) {
      await SubscriptionRepo.updateSubscription(subscription.id, {
        status: SubscriptionStatus.EXPIRED,
      });
    }
  } catch (error) {
    console.error(
      "[CRON] Failed to deactivate expired subscriptions (one-off):",
      error
    );
  }
}
