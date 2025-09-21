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

  // Get subscriptions expiring tomorrow (H-1)
  public static async getSubscriptionsExpiringTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const nextDay = new Date(tomorrow);
    nextDay.setDate(nextDay.getDate() + 1);

    return prisma.subscription.findMany({
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
  public static async getSubscriptionsExpiringInMinutes(minutes: number) {
    const now = new Date();
    const targetTime = new Date(now.getTime() + minutes * 60 * 1000);
    const nextMinute = new Date(targetTime.getTime() + 1 * 60 * 1000);

    return prisma.subscription.findMany({
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
  public static async getExpiredSubscriptions() {
    const now = new Date(); // Use current time, not start of day

    return prisma.subscription.findMany({
      where: {
        isActive: true,
        endDate: {
          lt: now, // Check if endDate is less than current time
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
