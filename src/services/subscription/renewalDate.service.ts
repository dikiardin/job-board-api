import { DateHelper } from "../../utils/dateHelper";

export class RenewalDateService {
  public static calculateRenewalDates(currentSubscription: any) {
    const now = new Date();
    const currentExpiry = new Date(currentSubscription.expiresAt);

    const startDate = currentExpiry > now ? currentExpiry : now;
    const expiresAt = DateHelper.getSubscriptionEndDate(startDate);

    return { startDate, expiresAt };
  }

  public static isWithinGracePeriod(expiryDate: Date): boolean {
    const now = new Date();
    const gracePeriodHours = 24; // Allow renewal within 24 hours after expiry (for testing)
    const gracePeriodMs = gracePeriodHours * 60 * 60 * 1000;

    return now.getTime() - expiryDate.getTime() <= gracePeriodMs;
  }
}
