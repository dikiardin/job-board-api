"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRepo = void 0;
const prisma_1 = require("../../config/prisma");
class SubscriptionRepo {
    // Get all subscriptions
    static async getAllSubscriptions() {
        return prisma_1.prisma.subscription.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                plan: true,
                payments: {
                    orderBy: { createdAt: "desc" },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    // Get subscription by ID
    static async getSubscriptionById(id) {
        return prisma_1.prisma.subscription.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                plan: true,
                payments: {
                    orderBy: { createdAt: "desc" },
                },
            },
        });
    }
    // Get user's subscriptions
    static async getUserSubscriptions(userId) {
        return prisma_1.prisma.subscription.findMany({
            where: { userId },
            include: {
                plan: true,
                payments: {
                    orderBy: { createdAt: "desc" },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    // Get user's active subscription
    static async getUserActiveSubscription(userId) {
        return prisma_1.prisma.subscription.findFirst({
            where: {
                userId,
                isActive: true,
                endDate: { gte: new Date() },
            },
            include: {
                plan: true,
            },
        });
    }
    // Create new subscription
    static async createSubscription(data) {
        return prisma_1.prisma.subscription.create({
            data,
            include: {
                plan: true,
            },
        });
    }
    // Update subscription
    static async updateSubscription(id, data) {
        return prisma_1.prisma.subscription.update({
            where: { id },
            data,
            include: {
                plan: true,
            },
        });
    }
    // Get subscriptions expiring tomorrow (H-1)
    static async getSubscriptionsExpiringTomorrow() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const nextDay = new Date(tomorrow);
        nextDay.setDate(nextDay.getDate() + 1);
        return prisma_1.prisma.subscription.findMany({
            where: {
                isActive: true,
                endDate: {
                    gte: tomorrow,
                    lt: nextDay,
                },
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                plan: true,
            },
        });
    }
    // Get subscriptions expiring in X minutes (for testing)
    static async getSubscriptionsExpiringInMinutes(minutes) {
        const now = new Date();
        const targetTime = new Date(now.getTime() + minutes * 60 * 1000);
        const nextMinute = new Date(targetTime.getTime() + 1 * 60 * 1000);
        return prisma_1.prisma.subscription.findMany({
            where: {
                isActive: true,
                endDate: {
                    gte: targetTime,
                    lt: nextMinute,
                },
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                plan: true,
            },
        });
    }
    // Get expired subscriptions
    static async getExpiredSubscriptions() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return prisma_1.prisma.subscription.findMany({
            where: {
                isActive: true,
                endDate: {
                    lt: today,
                },
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                plan: true,
            },
        });
    }
}
exports.SubscriptionRepo = SubscriptionRepo;
//# sourceMappingURL=subscription.repository.js.map