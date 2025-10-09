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
    const gracePeriodDays = 7;
    const gracePeriodMs = gracePeriodDays * 24 * 60 * 60 * 1000;
    
    return (now.getTime() - expiryDate.getTime()) <= gracePeriodMs;
  }
}
