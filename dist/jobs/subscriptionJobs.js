"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSubscriptionJobs = startSubscriptionJobs;
exports.runSubscriptionCycle = runSubscriptionCycle;
const node_cron_1 = __importDefault(require("node-cron"));
const subscription_repository_1 = require("../repositories/subscription/subscription.repository");
const email_service_1 = require("../services/subscription/email.service");
const prisma_1 = require("../generated/prisma");
// Simple in-memory deduplication for reminder emails to avoid duplicates
const sentReminderCache = new Map();
const REMINDER_DEDUP_MS = 2 * 60 * 60 * 1000; // 2 hours window
function startSubscriptionJobs() {
    // Reminder H-1 (every 10 minutes)
    node_cron_1.default.schedule("*/10 * * * *", async () => {
        try {
            const expiring = await subscription_repository_1.SubscriptionRepo.getSubscriptionsExpiringInHoursWindow(24, 10);
            for (const subscription of expiring) {
                if (subscription.expiresAt) {
                    const lastSentAt = sentReminderCache.get(subscription.id);
                    const now = Date.now();
                    if (!lastSentAt || now - lastSentAt > REMINDER_DEDUP_MS) {
                        await email_service_1.EmailService.sendSubscriptionExpirationEmail(subscription.user.email, subscription.user.name ?? subscription.user.email, subscription.plan.name, subscription.expiresAt);
                        sentReminderCache.set(subscription.id, now);
                    }
                }
            }
        }
        catch (error) {
            console.error("[CRON] Failed to send expiration reminders:", error);
        }
    });
    // Deactivate expired subscriptions (every 15 minutes)
    node_cron_1.default.schedule("*/15 * * * *", async () => {
        try {
            const expired = await subscription_repository_1.SubscriptionRepo.getExpiredSubscriptions();
            for (const subscription of expired) {
                await subscription_repository_1.SubscriptionRepo.updateSubscription(subscription.id, {
                    status: prisma_1.SubscriptionStatus.EXPIRED,
                });
            }
        }
        catch (error) {
            console.error("[CRON] Failed to deactivate expired subscriptions:", error);
        }
    });
}
// Run one cycle of subscription jobs (idempotent)
async function runSubscriptionCycle() {
    try {
        const expiring = await subscription_repository_1.SubscriptionRepo.getSubscriptionsExpiringInHoursWindow(24, 10);
        const now = Date.now();
        for (const subscription of expiring) {
            if (subscription.expiresAt) {
                const lastSentAt = sentReminderCache.get(subscription.id);
                if (!lastSentAt || now - lastSentAt > REMINDER_DEDUP_MS) {
                    await email_service_1.EmailService.sendSubscriptionExpirationEmail(subscription.user.email, subscription.user.name ?? subscription.user.email, subscription.plan.name, subscription.expiresAt);
                    sentReminderCache.set(subscription.id, now);
                }
            }
        }
    }
    catch (error) {
        console.error("[CRON] Failed to send expiration reminders (one-off):", error);
    }
    try {
        const expired = await subscription_repository_1.SubscriptionRepo.getExpiredSubscriptions();
        for (const subscription of expired) {
            await subscription_repository_1.SubscriptionRepo.updateSubscription(subscription.id, {
                status: prisma_1.SubscriptionStatus.EXPIRED,
            });
        }
    }
    catch (error) {
        console.error("[CRON] Failed to deactivate expired subscriptions (one-off):", error);
    }
}
