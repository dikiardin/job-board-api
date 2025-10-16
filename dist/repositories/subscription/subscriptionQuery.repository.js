"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionQueryRepo = void 0;
const prisma_1 = require("../../config/prisma");
const prisma_2 = require("../../generated/prisma");
class SubscriptionQueryRepo {
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
    static async getUserActiveSubscription(userId) {
        return prisma_1.prisma.subscription.findFirst({
            where: {
                userId,
                status: prisma_2.SubscriptionStatus.ACTIVE,
                expiresAt: { gte: new Date() },
            },
            include: {
                plan: true,
            },
        });
    }
}
exports.SubscriptionQueryRepo = SubscriptionQueryRepo;
