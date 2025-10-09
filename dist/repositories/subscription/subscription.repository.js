"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRepo = void 0;
const prisma_1 = require("../../config/prisma");
const prisma_2 = require("../../generated/prisma");
class SubscriptionRepo {
    static async getAllSubscriptions() {
        return prisma_1.prisma.subscription.findMany({
            include: {
                user: { select: { id: true, name: true, email: true } },
                plan: true,
                payments: { orderBy: { createdAt: "desc" } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    static async getSubscriptionById(id) {
        return prisma_1.prisma.subscription.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true } },
                plan: true,
                payments: { orderBy: { createdAt: "desc" } },
            },
        });
    }
    static async getUserSubscriptions(userId) {
        return prisma_1.prisma.subscription.findMany({
            where: { userId },
            include: {
                plan: true,
                payments: { orderBy: { createdAt: "desc" } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    static async getUserActiveSubscription(userId) {
        return prisma_1.prisma.subscription.findFirst({
            where: {
                userId,
                status: prisma_2.SubscriptionStatus.ACTIVE,
                expiresAt: { gt: new Date() },
            },
            include: { plan: true },
        });
    }
    static async createSubscription(data) {
        try {
            console.log("SubscriptionRepo.createSubscription called with data:", data);
            const result = await prisma_1.prisma.subscription.create({
                data,
                include: { plan: true },
            });
            console.log("SubscriptionRepo.createSubscription result:", result);
            return result;
        }
        catch (error) {
            console.error("Error in SubscriptionRepo.createSubscription:", error);
            throw error;
        }
    }
    static async updateSubscription(id, data) {
        return prisma_1.prisma.subscription.update({
            where: { id },
            data,
            include: { plan: true },
        });
    }
    static async getSubscriptionsExpiringInMinutes(minutes) {
        const now = new Date();
        const windowStart = new Date(now.getTime() + minutes * 60 * 1000);
        const windowEnd = new Date(windowStart.getTime() + 60 * 1000);
        return prisma_1.prisma.subscription.findMany({
            where: {
                status: prisma_2.SubscriptionStatus.ACTIVE,
                expiresAt: { gte: windowStart, lt: windowEnd },
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                plan: true,
            },
        });
    }
    static async getSubscriptionsExpiringWithinHours(hours) {
        const now = new Date();
        const windowStart = new Date(now.getTime() + hours * 60 * 60 * 1000);
        const windowEnd = new Date(windowStart.getTime() + 60 * 60 * 1000);
        return prisma_1.prisma.subscription.findMany({
            where: {
                status: prisma_2.SubscriptionStatus.ACTIVE,
                expiresAt: { gte: windowStart, lt: windowEnd },
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                plan: true,
            },
        });
    }
    static async getExpiredSubscriptions() {
        return prisma_1.prisma.subscription.findMany({
            where: {
                status: prisma_2.SubscriptionStatus.ACTIVE,
                expiresAt: { lt: new Date() },
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                plan: true,
            },
        });
    }
}
exports.SubscriptionRepo = SubscriptionRepo;
//# sourceMappingURL=subscription.repository.js.map