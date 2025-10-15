import { prisma } from "../../config/prisma";
import { SubscriptionStatus } from "../../generated/prisma";

export class SubscriptionRepo {
  public static async getAllSubscriptions() {
    return prisma.subscription.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: true,
        payments: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async getSubscriptionById(id: number) {
    return prisma.subscription.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: true,
        payments: { orderBy: { createdAt: "desc" } },
      },
    });
  }

  public static async getUserSubscriptions(userId: number) {
    return prisma.subscription.findMany({
      where: { userId },
      include: {
        plan: true,
        payments: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async getUserActiveSubscription(userId: number) {
    return prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        expiresAt: { gt: new Date() },
      },
      include: { plan: true },
    });
  }

  public static async createSubscription(data: {
    userId: number;
    planId: number;
    status?: SubscriptionStatus;
    startDate?: Date;
    expiresAt?: Date;
  }) {
    try {
      const result = await prisma.subscription.create({
        data,
        include: { plan: true },
      });
      return result;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error in SubscriptionRepo.createSubscription:", error);
      }
      throw error;
    }
  }

  public static async updateSubscription(
    id: number,
    data: Partial<{
      status: SubscriptionStatus;
      startDate: Date | null;
      expiresAt: Date | null;
      paidAt: Date | null;
      approvedByDeveloperId: number | null;
    }>
  ) {
    return prisma.subscription.update({
      where: { id },
      data,
      include: { plan: true },
    });
  }

  public static async getSubscriptionsExpiringInMinutes(minutes: number) {
    const now = new Date();
    const windowStart = new Date(now.getTime() + minutes * 60 * 1000);
    const windowEnd = new Date(windowStart.getTime() + 60 * 1000);

    return prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        expiresAt: { gte: windowStart, lt: windowEnd },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: true,
      },
    });
  }

  public static async getSubscriptionsExpiringWithinHours(hours: number) {
    const now = new Date();
    const windowStart = new Date(now.getTime() + hours * 60 * 60 * 1000);
    const windowEnd = new Date(windowStart.getTime() + 60 * 60 * 1000);

    return prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        expiresAt: { gte: windowStart, lt: windowEnd },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: true,
      },
    });
  }

  public static async getExpiredSubscriptions() {
    return prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        expiresAt: { lt: new Date() },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: true,
      },
    });
  }
}
