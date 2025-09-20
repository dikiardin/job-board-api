import { prisma } from "../../config/prisma";

export class SubscriptionRepo {
  // Get all subscriptions
  public static async getAllSubscriptions() {
    return prisma.subscription.findMany({
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
  public static async getSubscriptionById(id: number) {
    return prisma.subscription.findUnique({
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
  public static async getUserSubscriptions(userId: number) {
    return prisma.subscription.findMany({
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
  public static async getUserActiveSubscription(userId: number) {
    return prisma.subscription.findFirst({
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
  public static async createSubscription(data: {
    userId: number;
    subscriptionPlanId: number;
    startDate: Date;
    endDate: Date;
  }) {
    return prisma.subscription.create({
      data,
      include: {
        plan: true,
      },
    });
  }

  // Update subscription
  public static async updateSubscription(
    id: number,
    data: {
      isActive?: boolean;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    return prisma.subscription.update({
      where: { id },
      data,
      include: {
        plan: true,
      },
    });
  }
}
