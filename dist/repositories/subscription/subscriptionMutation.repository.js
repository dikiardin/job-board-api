"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionMutationRepo = void 0;
const prisma_1 = require("../../config/prisma");
class SubscriptionMutationRepo {
    static async createSubscription(data) {
        return prisma_1.prisma.subscription.create({
            data,
            include: {
                plan: true,
            },
        });
    }
    static async updateSubscription(id, data) {
        return prisma_1.prisma.subscription.update({
            where: { id },
            data,
            include: {
                plan: true,
            },
        });
    }
}
exports.SubscriptionMutationRepo = SubscriptionMutationRepo;
