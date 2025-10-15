"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenewalPaymentService = void 0;
const payment_repository_1 = require("../../repositories/subscription/payment.repository");
const dateHelper_1 = require("../../utils/dateHelper");
class RenewalPaymentService {
    static async createPayment(subscriptionId, amount) {
        return await payment_repository_1.PaymentRepo.createPayment({
            subscriptionId,
            paymentMethod: "TRANSFER",
            amount,
            expiresAt: dateHelper_1.DateHelper.getPaymentExpiration()
        });
    }
    static async getPendingPayment(userId, subscriptionIds) {
        if (subscriptionIds.length === 0)
            return null;
        const payments = await payment_repository_1.PaymentRepo.getPendingPayments();
        return payments.find(payment => subscriptionIds.includes(payment.subscriptionId) &&
            payment.subscription.userId === userId) || null;
    }
}
exports.RenewalPaymentService = RenewalPaymentService;
//# sourceMappingURL=renewalPayment.service.js.map