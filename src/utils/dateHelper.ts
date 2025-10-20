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
    // TESTING: Set to 3 minutes duration (change back to 30 days after testing)
    return new Date(startDate.getTime() + 3 * 60 * 1000);
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

  // Get reminder time (50 minutes before expiry)
  public static getReminderTime(expiryDate: Date): Date {
    const reminderTime = new Date(expiryDate);
    reminderTime.setMinutes(reminderTime.getMinutes() - 50);
    return reminderTime;
  }

  // Check if current time is within reminder window (50 minutes before expiry)
  public static isReminderTime(expiryDate: Date): boolean {
    const now = new Date();
    const reminderTime = this.getReminderTime(expiryDate);
    return now >= reminderTime && now < expiryDate;
  }
}
