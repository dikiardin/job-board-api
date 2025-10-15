"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionExpiryRepo = void 0;
const prisma_1 = require("../../config/prisma");
const dateHelper_1 = require("../../utils/dateHelper");
class SubscriptionExpiryRepo {
    static async getSubscriptionsExpiringTomorrow() {
        const tomorrow = dateHelper_1.DateHelper.getTomorrowDate();
        const nextDay = dateHelper_1.DateHelper.getNextDayDate(tomorrow);
        return prisma_1.prisma.subscription.findMany({
            where: {
                status: "ACTIVE",
                expiresAt: {
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
    static async getSubscriptionsExpiringInMinutes(minutes) {
        const targetTime = dateHelper_1.DateHelper.getExpirationInMinutes(minutes);
        const nextMinute = dateHelper_1.DateHelper.getExpirationInMinutes(minutes + 1);
        return prisma_1.prisma.subscription.findMany({
            where: {
                status: "ACTIVE",
                expiresAt: {
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
    static async getExpiredSubscriptions() {
        const now = dateHelper_1.DateHelper.getCurrentTime();
        return prisma_1.prisma.subscription.findMany({
            where: {
                status: "ACTIVE",
                expiresAt: {
                    lt: now,
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
exports.SubscriptionExpiryRepo = SubscriptionExpiryRepo;
//# sourceMappingURL=subscriptionExpiry.repository.js.map