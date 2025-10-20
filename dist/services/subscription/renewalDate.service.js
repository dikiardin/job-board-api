"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenewalDateService = void 0;
const dateHelper_1 = require("../../utils/dateHelper");
class RenewalDateService {
    static calculateRenewalDates(currentSubscription) {
        const now = new Date();
        const currentExpiry = new Date(currentSubscription.expiresAt);
        const startDate = currentExpiry > now ? currentExpiry : now;
        const expiresAt = dateHelper_1.DateHelper.getSubscriptionEndDate(startDate);
        return { startDate, expiresAt };
    }
    static isWithinGracePeriod(expiryDate) {
        const now = new Date();
        const gracePeriodHours = 24; // Allow renewal within 24 hours after expiry (for testing)
        const gracePeriodMs = gracePeriodHours * 60 * 60 * 1000;
        return now.getTime() - expiryDate.getTime() <= gracePeriodMs;
    }
}
exports.RenewalDateService = RenewalDateService;
