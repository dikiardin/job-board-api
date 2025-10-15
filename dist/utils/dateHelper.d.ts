export declare class DateHelper {
    static getPlaceholderDate(): Date;
    static getPaymentExpiration(): Date;
    static getSubscriptionEndDate(startDate: Date): Date;
    static getTomorrowDate(): Date;
    static getNextDayDate(date: Date): Date;
    static getExpirationInMinutes(minutes: number): Date;
    static getCurrentTime(): Date;
    static getReminderTime(expiryDate: Date): Date;
    static isReminderTime(expiryDate: Date): boolean;
}
//# sourceMappingURL=dateHelper.d.ts.map