import { prisma } from "../../config/prisma";
import { SubscriptionPlanCode } from "../../generated/prisma";

export class PlanRepo {
  // Get all subscription plans
  public static async getAllPlans() {
    return prisma.subscriptionPlan.findMany({
      orderBy: { priceIdr: "asc" },
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
    code: SubscriptionPlanCode;
    name: string;
    priceIdr: number;
    description?: string;
    perks?: string[];
    monthlyAssessmentQuota?: number;
    priorityCvReview?: boolean;
    cvGeneratorEnabled?: boolean;
  }) {
    return prisma.subscriptionPlan.create({
      data,
    });
  }

  // Update subscription plan
  public static async updatePlan(
    id: number,
    data: {
      name?: string;
      priceIdr?: number;
      description?: string;
      perks?: string[];
      monthlyAssessmentQuota?: number;
      priorityCvReview?: boolean;
      cvGeneratorEnabled?: boolean;
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
      select: { planId: true },
    });
  }
}
