"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanRepo = void 0;
const prisma_1 = require("../../config/prisma");
class PlanRepo {
    // Get all subscription plans
    static async getAllPlans() {
        return prisma_1.prisma.subscriptionPlan.findMany({
            orderBy: { priceIdr: "asc" },
        });
    }
    // Get plan by ID
    static async getPlanById(id) {
        return prisma_1.prisma.subscriptionPlan.findUnique({
            where: { id },
        });
    }
    // Create new subscription plan
    static async createPlan(data) {
        return prisma_1.prisma.subscriptionPlan.create({
            data,
        });
    }
    // Update subscription plan
    static async updatePlan(id, data) {
        return prisma_1.prisma.subscriptionPlan.update({
            where: { id },
            data,
        });
    }
    // Delete subscription plan
    static async deletePlan(id) {
        return prisma_1.prisma.subscriptionPlan.delete({
            where: { id },
        });
    }
    // Get all subscriptions (for checking if plan is in use)
    static async getAllSubscriptions() {
        return prisma_1.prisma.subscription.findMany({
            select: { planId: true },
        });
    }
}
exports.PlanRepo = PlanRepo;
//# sourceMappingURL=plan.repository.js.map