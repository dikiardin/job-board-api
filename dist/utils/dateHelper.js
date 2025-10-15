"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateHelper = void 0;
class DateHelper {
    static getPlaceholderDate() {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
    }
    static getPaymentExpiration() {
        return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }
    static getSubscriptionEndDate(startDate) {
        const endDate = new Date(startDate);
        // Set to 1 hour duration
        endDate.setHours(endDate.getHours() + 1);
        return endDate;
    }
    static getTomorrowDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
    }
    static getNextDayDate(date) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay;
    }
    static getExpirationInMinutes(minutes) {
        const now = new Date();
        return new Date(now.getTime() + minutes * 60 * 1000);
    }
    static getCurrentTime() {
        return new Date();
    }
    // Get reminder time (50 minutes before expiry)
    static getReminderTime(expiryDate) {
        const reminderTime = new Date(expiryDate);
        reminderTime.setMinutes(reminderTime.getMinutes() - 50);
        return reminderTime;
    }
    // Check if current time is within reminder window (50 minutes before expiry)
    static isReminderTime(expiryDate) {
        const now = new Date();
        const reminderTime = this.getReminderTime(expiryDate);
        return now >= reminderTime && now < expiryDate;
    }
}
exports.DateHelper = DateHelper;
//# sourceMappingURL=dateHelper.js.map