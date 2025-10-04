import { prisma } from "../../config/prisma";
import { DateHelper } from "../../utils/dateHelper";

export class SubscriptionExpiryRepo {
  public static async getSubscriptionsExpiringTomorrow() {
    const tomorrow = DateHelper.getTomorrowDate();
    const nextDay = DateHelper.getNextDayDate(tomorrow);

    return prisma.subscription.findMany({
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

  public static async getSubscriptionsExpiringInMinutes(minutes: number) {
    const targetTime = DateHelper.getExpirationInMinutes(minutes);
    const nextMinute = DateHelper.getExpirationInMinutes(minutes + 1);

    return prisma.subscription.findMany({
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

  public static async getExpiredSubscriptions() {
    const now = DateHelper.getCurrentTime();

    return prisma.subscription.findMany({
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
