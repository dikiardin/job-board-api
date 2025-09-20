import { prisma } from "../../config/prisma";

export class PlanRepo {
  // Get all subscription plans
  public static async getAllPlans() {
    return prisma.subscriptionPlan.findMany({
      orderBy: { planPrice: "asc" },
    });
  }

  // Get plan by ID
  public static async getPlanById(id: number) {
    return prisma.subscriptionPlan.findUnique({
      where: { id },
    });
  }

  // Create new subscription plan
  public static async createPlan(data: {
    planName: string;
    planPrice: number;
    planDescription: string;
  }) {
    return prisma.subscriptionPlan.create({
      data,
    });
  }

  // Update subscription plan
  public static async updatePlan(
    id: number,
    data: {
      planName?: string;
      planPrice?: number;
      planDescription?: string;
    }
  ) {
    return prisma.subscriptionPlan.update({
      where: { id },
      data,
    });
  }

  // Delete subscription plan
  public static async deletePlan(id: number) {
    return prisma.subscriptionPlan.delete({
      where: { id },
    });
  }

  // Get all subscriptions (for checking if plan is in use)
  public static async getAllSubscriptions() {
    return prisma.subscription.findMany({
      select: { subscriptionPlanId: true },
    });
  }
}
