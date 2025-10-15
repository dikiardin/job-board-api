import cron from "node-cron";
import { SubscriptionRepo } from "../repositories/subscription/subscription.repository";
import { EmailService } from "../services/subscription/email.service";
import { SubscriptionStatus } from "../generated/prisma";

// Simple in-memory deduplication for reminder emails to avoid duplicates
const sentReminderCache = new Map<number, number>();
const REMINDER_DEDUP_MS = 2 * 60 * 60 * 1000; // 2 hours window

export function startSubscriptionJobs() {
  // Reminder H-1 (every 10 minutes)
  cron.schedule("*/10 * * * *", async () => {
    try {
      const expiring =
        await SubscriptionRepo.getSubscriptionsExpiringInHoursWindow(24, 10);

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
    const expiring =
      await SubscriptionRepo.getSubscriptionsExpiringInHoursWindow(24, 10);
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
