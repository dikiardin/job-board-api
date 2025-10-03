export class DateHelper {
  public static getPlaceholderDate(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  }

  public static getPaymentExpiration(): Date {
    return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  }

  public static getSubscriptionEndDate(startDate: Date): Date {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30); // 30 days
    return endDate;
  }

  public static getTomorrowDate(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  public static getNextDayDate(date: Date): Date {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  }

  public static getExpirationInMinutes(minutes: number): Date {
    const now = new Date();
    return new Date(now.getTime() + minutes * 60 * 1000);
  }

  public static getCurrentTime(): Date {
    return new Date();
  }
}
